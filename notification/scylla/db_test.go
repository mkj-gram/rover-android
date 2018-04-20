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
	"github.com/roverplatform/rover/go/cql"
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
	t.Helper()

	// Global session is a session which is not bound to a keyspace
	config.Keyspace = ""
	globalSession := NewTestSession(t, &config)
	defer globalSession.Close()

	Teardown(t, globalSession, keyspace)
	CreateKeyspace(t, globalSession, keyspace)

	// modify the cluster config to only look in 1 keyspace
	config.Keyspace = keyspace
	keyspaceSession := NewTestSession(t, &config)
	defer keyspaceSession.Close()

	MigrateDB(t, keyspaceSession, migrationPath)
}

// ClearDB resets the default db by truncating tables used for tests
func ClearDB(t *testing.T) *gocql.Session {
	t.Helper()

	config, _ := DefaultClusterConfig(t)
	session := NewTestSession(t, config)
	// TODO find all tables first then truncate
	TruncateTables(t, session, ListTables(t, session)...)
	return session
}

// ClearDBWithFixtures resets the db and then applies the given fixtures
func ClearDBWithFixtures(t *testing.T, files string) {
	t.Helper()
	InsertFixtures(t, ClearDB(t), files)
}

func DefaultClusterConfig(t *testing.T) (*gocql.ClusterConfig, string) {
	t.Helper()

	config, err := cql.ParseDSN(*testDSN)
	if err != nil {
		t.Fatal(err)
	}

	if strings.Contains(config.Keyspace, "test") == false {
		t.Fatalf("Are you sure you want to connect to: %s it doesn't look like a test dsn", *testDSN)
	}

	return config, config.Keyspace
}

func NewTestSession(t *testing.T, config *gocql.ClusterConfig) *gocql.Session {
	t.Helper()

	session, err := config.CreateSession()
	if err != nil {
		t.Fatal(err)
	}

	return session
}

func ListTables(t *testing.T, session *gocql.Session) []string {

	var tables []string

	_, keyspace := DefaultClusterConfig(t)

	meta, err := session.KeyspaceMetadata(keyspace)
	if err != nil {
		t.Fatal(err)
	}

	for _, table := range meta.Tables {
		tables = append(tables, table.Name)
	}

	return tables

}

func TruncateTables(t *testing.T, session *gocql.Session, tables ...string) {
	for _, table := range tables {
		if table == "gocqlx_migrate" {
			continue
		}
		stmt := fmt.Sprintf(`TRUNCATE TABLE %s`, table)
		if err := session.Query(stmt).Exec(); err != nil {
			t.Fatal(err)
		}
	}
}

// InsertFixtures reads an array of matches or files and runs the cql commands against the provided session
func InsertFixtures(t *testing.T, session *gocql.Session, matches ...string) {

	var files []string

	for _, match := range matches {
		var lookup string
		if strings.HasSuffix(match, ".cql") == true {
			lookup = match
		} else {
			lookup = filepath.Join(match, "*.cql")
		}

		f, err := filepath.Glob(lookup)
		if err != nil {
			t.Fatal(err)
		}

		files = append(files, f...)
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
	t.Helper()

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
