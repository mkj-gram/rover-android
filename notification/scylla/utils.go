package scylla

import (
	"net/url"
	"strings"
	"time"

	"github.com/gocql/gocql"
	"github.com/pkg/errors"
)

func ParseDSN(dsn string) (*gocql.ClusterConfig, error) {
	u, err := url.Parse(dsn)
	if err != nil {
		return nil, err
	}

	var (
		cfg = gocql.NewCluster()
	)

	cfg.Hosts = strings.Split(u.Host, ",")
	if len(u.Path) > 1 {
		cfg.Keyspace = u.Path[1:]
	}

	if u.User != nil {
		pass, _ := u.User.Password()
		cfg.Authenticator = gocql.PasswordAuthenticator{
			Password: pass,
			Username: u.User.Username(),
		}
	}

	var q = u.Query()
	// TODO: support more
	switch q.Get("consistency") {
	case "all":
		cfg.Consistency = gocql.All
	case "", "quorum":
		cfg.Consistency = gocql.Quorum
	default:
		return cfg, errors.Wrap(ErrInvalid, "consistency")
	}

	switch str := q.Get("timeout"); str {
	case "":
		// use default
	default:
		timeout, err := time.ParseDuration(str)
		if err != nil {
			return cfg, errors.Wrap(err, "duration")
		}
		cfg.Timeout = timeout
	}

	return cfg, nil
}
