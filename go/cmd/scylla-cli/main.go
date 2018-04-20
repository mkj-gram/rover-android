package main

import (
	"context"
	"fmt"
	"log"

	"github.com/gocql/gocql"
	"github.com/namsral/flag"
	"github.com/roverplatform/rover/go/cql"
	"github.com/scylladb/gocqlx/migrate"
)

var migration struct {
	DSN  string
	Path string

	CreateKeyspace   bool
	KeyspaceReplicas int
}

func main() {

	flag.StringVar(&migration.DSN, "dsn", ``, "scylla DSN")
	flag.StringVar(&migration.Path, "migration-path", ``, "migration path")
	flag.BoolVar(&migration.CreateKeyspace, "create-keyspace", false, "if the provided keyspace should be created with default settings")
	flag.IntVar(&migration.KeyspaceReplicas, "keyspace-replicas", 1, "number of replicas the keyspace with use")

	flag.Parse()

	log.Println("Migrating: ", migration)

	config, err := cql.ParseDSN(migration.DSN)
	if err != nil {
		log.Fatalln(err)
	}

	if migration.CreateKeyspace == true {
		if config.Keyspace == "" {
			log.Fatalln("Cannot create empty keyspace")
		}

		err = createKeyspace(config.Keyspace, migration.KeyspaceReplicas, *config)
		if err != nil {
			log.Fatalln(err)
		}
	}

	session, err := config.CreateSession()
	if err != nil {
		log.Fatalln(err)
	}

	err = migrate.Migrate(context.Background(), session, migration.Path)
	if err != nil {
		log.Fatalln(err)
	}

	log.Println("success")
}

func createKeyspace(keyspace string, replicas int, config gocql.ClusterConfig) error {
	stmt := fmt.Sprintf(`
		CREATE KEYSPACE IF NOT EXISTS %s
		WITH REPLICATION = {
			'class': 'SimpleStrategy', 'replication_factor': %d
		}
	`, keyspace, replicas)

	config.Keyspace = ""
	session, err := config.CreateSession()
	if err != nil {
		return err
	}

	if err := session.Query(stmt).Exec(); err != nil {
		return err
	}

	return nil
}
