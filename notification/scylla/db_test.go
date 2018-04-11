package scylla_test

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strings"
	"testing"

	"github.com/gocql/gocql"
	"github.com/namsral/flag"
	"github.com/roverplatform/rover/notification/scylla"
	"github.com/scylladb/gocqlx/migrate"
)

var testDSN = flag.String("test-scylladb-dsn", "scylla://scylla:9042/notification_test", "")

func init() {
	flag.Parse()
}

// Holds a suite of util functions for running tests

func Teardown(t *testing.T, session *gocql.Session, keyspace string) {
	if err := session.Query(`DROP KEYSPACE IF EXISTS ` + keyspace).Exec(); err != nil {
		t.Fatal(err)
	}
}

func CreateKeyspace(t *testing.T, session *gocql.Session, keyspace string) {

	stmt := fmt.Sprintf(`
		CREATE KEYSPACE IF NOT EXISTS %s
		WITH REPLICATION = {
			'class': 'SimpleStrategy', 'replication_factor': 0
		}
	`, keyspace)

	if err := session.Query(stmt).Exec(); err != nil {
		t.Fatal(err)
	}
}

func MigrateDB(t *testing.T, session *gocql.Session, dir string) {
	if err := migrate.Migrate(context.Background(), session, dir); err != nil {
		t.Fatal(err)
	}
}

func ResetDB(t *testing.T, config gocql.ClusterConfig, keyspace string, migrationPath string) {

	// Global session is a session which is not bound to a keyspace
	config.Keyspace = ""
	globalSession := NewTestSession(t, &config)
	defer globalSession.Close()

	Teardown(t, globalSession, keyspace)
	CreateKeyspace(t, globalSession, keyspace)

	// modify the cluster config to only look in 1 keyspace
	config.Keyspace = keyspace
	keyspaceSession := NewTestSession(t, &config)
	MigrateDB(t, keyspaceSession, migrationPath)

	keyspaceSession.Close()
	globalSession.Close()
}

func DefaultClusterConfig(t *testing.T) (*gocql.ClusterConfig, string) {

	info, err := scylla.ParseDSN(*testDSN)
	if err != nil {
		t.Fatal(err)
	}

	if strings.Contains(info.Keyspace, "test") == false {
		t.Fatalf("Are you sure you want to connect to: %s it doesn't look like a test dsn", *testDSN)
	}

	return NewClusterConfig(info.Hosts, info.Keyspace), info.Keyspace

}

func NewClusterConfig(hosts []string, keyspace string) *gocql.ClusterConfig {
	cluster := gocql.NewCluster(hosts...)
	cluster.Consistency = gocql.Quorum

	if keyspace != "" {
		cluster.Keyspace = keyspace
	}

	return cluster
}

func NewTestSession(t *testing.T, config *gocql.ClusterConfig) *gocql.Session {

	session, err := config.CreateSession()
	if err != nil {
		t.Fatal(err)
	}

	return session
}

func InsertFixtures(t *testing.T, session *gocql.Session, dir string) {

	files, err := filepath.Glob(filepath.Join(dir, "*.cql"))
	if err != nil {
		t.Fatal(err)
	}

	for _, file := range files {
		f, err := os.Open(file)
		if err != nil {
			t.Fatal(err)
		}

		b, err := ioutil.ReadAll(f)
		f.Close()
		if err != nil {
			t.Fatal(err)
		}

		runFixture(t, session, b)
	}
}

func runFixture(t *testing.T, session *gocql.Session, fixture []byte) {
	r := bytes.NewBuffer(fixture)
	for {
		stmt, err := r.ReadString(';')
		if err == io.EOF {
			break
		}
		if err != nil {
			t.Fatal(err)
		}

		if err := session.Query(stmt).Exec(); err != nil {
			t.Fatal(err)
		}

	}
}
