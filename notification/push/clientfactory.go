package push

import (
	"context"
	"crypto/tls"
	"encoding/base64"
	"fmt"
	"strings"
	"time"

	"github.com/pkg/errors"
	"golang.org/x/crypto/pkcs12"

	fcm "github.com/appleboy/go-fcm"
	"github.com/karlseguin/ccache"
	"github.com/sideshow/apns2"

	"github.com/roverplatform/rover/notification/postgres"
)

var (
	ErrNotFound = errors.New("not found")
)

type (
	IosPlatformStore interface {
		ListByAccountId(ctx context.Context, acctId int32) ([]*postgres.IosPlatform, error)
	}

	AndroidPlatformStore interface {
		ListByAccountId(ctx context.Context, acctId int32) ([]*postgres.AndroidPlatform, error)
	}
)

type ClientFactory struct {
	MaxAge time.Duration
	Cache  *ccache.Cache

	IosPlatformsStore     IosPlatformStore
	AndroidPlatformsStore AndroidPlatformStore

	NewAPNSClient func(p *postgres.IosPlatform) (*apns2.Client, error)
	NewFCMClient  func(p *postgres.AndroidPlatform) (*fcm.Client, error)
}

func (c *ClientFactory) GetAPNSClient(ctx context.Context, acctId int32, bundleId string, env string) (*apns2.Client, error) {
	env = strings.ToLower(env)
	var (
		cacheKey = fmt.Sprintf("ios:%d:%s:%s", acctId, bundleId, env)
		item     = c.Cache.Get(cacheKey)
	)

	if item != nil {
		if client, ok := item.Value().(*apns2.Client); ok && !item.Expired() {
			return client, nil
		}
	}

	var p *postgres.IosPlatform

	if bundleId == "io.rover.Inbox" {
		p = postgres.RoverInboxIosPlatform
	} else {
		ps, err := c.IosPlatformsStore.ListByAccountId(ctx, acctId)
		if err != nil {
			return nil, errors.Wrap(err, "ListByAccountId")
		}

		for i := range ps {
			if ps[i].BundleId != bundleId {
				continue
			}
			p = ps[i]
			break
		}
	}

	if p == nil {
		return nil, errors.Wrapf(ErrNotFound, "bundle=%q", bundleId)
	}

	var (
		client *apns2.Client
		err    error
	)

	if c.NewAPNSClient == nil {
		client, err = NewAPNSClient(p)
	} else {
		client, err = c.NewAPNSClient(p)
	}
	if err != nil {
		return nil, errors.Wrap(err, "NewAPNSClient")
	}

	switch env {
	case "production":
		client = client.Production()
	case "development":
		client = client.Development()
	case "test":
		// noop
	default:
		return nil, errors.Wrapf(ErrUnknown, "environment=%q", env)
	}

	c.Cache.Set(cacheKey, client, c.MaxAge)

	return client, nil
}

func (c *ClientFactory) GetFCMClient(ctx context.Context, acctId int32) (*fcm.Client, error) {
	var (
		cacheKey = fmt.Sprintf("android:%d", acctId)
		item     = c.Cache.Get(cacheKey)
	)

	if item != nil {
		if client, ok := item.Value().(*fcm.Client); ok && !item.Expired() {
			return client, nil
		}
	}

	ps, err := c.AndroidPlatformsStore.ListByAccountId(ctx, acctId)
	if err != nil {
		return nil, errors.Wrap(err, "ListByAccountId")
	}

	getPlatform := func() *postgres.AndroidPlatform {
		if len(ps) > 0 {
			return ps[0]
		}

		return nil
	}

	var p = getPlatform()
	if p == nil {
		return nil, errors.Wrap(ErrNotFound, "platform")
	}

	var client *fcm.Client
	if c.NewFCMClient == nil {
		client, err = NewFCMClient(p)
	} else {
		client, err = c.NewFCMClient(p)
	}
	if err != nil {
		return nil, errors.Wrap(err, "NewFCMClient")
	}

	c.Cache.Set(cacheKey, client, c.MaxAge)

	return client, nil
}

func NewAPNSClient(p *postgres.IosPlatform) (*apns2.Client, error) {
	if p.CertificateExpiresAt != nil && time.Now().After(*p.CertificateExpiresAt) {
		return nil, errors.Wrap(
			&retryable{error: errors.Errorf("certificate expired: platform_id=%d", p.Id)},
			"NewAPNSClient",
		)
	}

	certData, err := base64.StdEncoding.DecodeString(p.CertificateData)
	if err != nil {
		return nil, errors.Wrap(err, "base64.DecodeString")
	}

	pkey, cert, err := pkcs12.Decode(certData, p.CertificatePassphrase)
	if err != nil {
		return nil, errors.Wrap(err, "pkcs12.Decode")
	}

	tlsCert := tls.Certificate{
		Certificate: [][]byte{cert.Raw},
		PrivateKey:  pkey,
		Leaf:        cert,
	}

	return apns2.NewClient(tlsCert), nil
}

func NewFCMClient(p *postgres.AndroidPlatform) (*fcm.Client, error) {
	c, err := fcm.NewClient(p.PushCredentialsServerKey)
	if err != nil {
		return nil, errors.Wrap(err, "fcm.NewClient")
	}
	return c, nil
}
