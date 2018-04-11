package scylla

import (
	"github.com/gocql/gocql"
)

type Option func(db *DB)

type ClusterOption func(config *gocql.ClusterConfig)

func WithDefaultKeyspace(keyspace string) ClusterOption {
	return func(config *gocql.ClusterConfig) {
		config.Keyspace = keyspace
	}
}

func WithConsistency(consistency gocql.Consistency) ClusterOption {
	return func(config *gocql.ClusterConfig) {
		config.Consistency = consistency
	}
}
