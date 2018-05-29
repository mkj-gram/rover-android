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

	NewAPNSClient func(certData, certKey string) (*apns2.Client, error)
	NewFCMClient  func(serverKey string) (*fcm.Client, error)
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

	var (
		certData, certKey string
	)

	if isRoverInboxIOSApp(bundleId) {
		certData, certKey = RoverInbox.APNS.CertData, RoverInbox.APNS.CertKey
	} else {
		ps, err := c.IosPlatformsStore.ListByAccountId(ctx, acctId)
		if err != nil {
			return nil, errors.Wrap(err, "ListByAccountId")
		}

		var p *postgres.IosPlatform
		for i := range ps {
			if ps[i].BundleId != bundleId {
				continue
			}
			p = ps[i]
			break
		}

		if p == nil {
			return nil, errors.Wrapf(ErrNotFound, "apns: bundle=%q", bundleId)
		}

		if p.CertificateExpiresAt != nil && time.Now().After(*p.CertificateExpiresAt) {
			return nil, &retryable{
				error: errors.Errorf("certificate expired: platform_id=%d", p.Id),
			}
		}

		certData, certKey = p.CertificateData, p.CertificatePassphrase
	}

	var newClient = c.NewAPNSClient
	if newClient == nil {
		newClient = NewAPNSClient
	}

	client, err := newClient(certData, certKey)
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

func (c *ClientFactory) GetFCMClient(ctx context.Context, acctId int32, packageName string) (*fcm.Client, error) {
	var (
		cacheKey = fmt.Sprintf("android:%d", acctId)
		item     = c.Cache.Get(cacheKey)
	)

	if item != nil {
		if client, ok := item.Value().(*fcm.Client); ok && !item.Expired() {
			return client, nil
		}
	}

	var (
		serverKey string
	)

	if isRoverInboxAndroidApp(packageName) {
		serverKey = RoverInbox.FCM.ServerKey
	} else {
		ps, err := c.AndroidPlatformsStore.ListByAccountId(ctx, acctId)
		if err != nil {
			return nil, errors.Wrap(err, "ListByAccountId")
		}

		var getPlatform = func() *postgres.AndroidPlatform {
			// TODO: search by sender id
			if len(ps) > 0 {
				return ps[0]
			}

			return nil
		}

		var p = getPlatform()
		if p == nil {
			return nil, errors.Wrap(ErrNotFound, "platform")
		}

		serverKey = p.PushCredentialsServerKey
	}

	var newClient = c.NewFCMClient
	if newClient == nil {
		newClient = NewFCMClient
	}

	client, err := newClient(serverKey)
	if err != nil {
		return nil, errors.Wrap(err, "fcm: newClient")
	}

	c.Cache.Set(cacheKey, client, c.MaxAge)

	return client, nil
}

func NewAPNSClient(certDataBase64Encoded string, certKey string) (*apns2.Client, error) {
	certData, err := base64.StdEncoding.DecodeString(certDataBase64Encoded)
	if err != nil {
		return nil, errors.Wrap(err, "base64.DecodeString")
	}

	pkey, cert, err := pkcs12.Decode(certData, certKey)
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

func NewFCMClient(serverKey string) (*fcm.Client, error) {
	c, err := fcm.NewClient(serverKey)
	if err != nil {
		return nil, errors.Wrap(err, "fcm.NewClient")
	}
	return c, nil
}
