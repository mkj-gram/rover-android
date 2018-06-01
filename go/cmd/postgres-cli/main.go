package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/url"
	"os"

	"github.com/lib/pq"
	"github.com/namsral/flag"
	"github.com/pkg/errors"
	"github.com/pressly/goose"
)

var (
	createCmd  = flag.NewFlagSet("create", flag.ExitOnError)
	migrateCmd = flag.NewFlagSet("migrate", flag.ExitOnError)

	/* CreateCmd flags */
	createDbDsn = createCmd.String("db-dsn", "postgres://postgres@postgres:5432?sslmode=disable", "database url")

	/* MigrateCmd flags */
	migrateDbDsn   = migrateCmd.String("db-dsn", ``, "db DSN")
	migratePath    = migrateCmd.String("migration-path", ``, "path to migrations")
	migrateCommand = migrateCmd.String("migration-cmd", `up`, "migration cmd")
	migrateArgs    = migrateCmd.String("migration-args", ``, "migration args")
)

type Command interface {
	Run() error
}

type CreateCommand struct {
	DSN string
}

func (c CreateCommand) Run() error {
	u, err := url.Parse(c.DSN)
	if err != nil {
		return err
	}

	if len(u.Path) == 0 {
		return errors.New("db name cannot be empty")
	}
	var dbName = u.Path[1:]
	// Strip path to login into default db
	u.Path = ""
	db, err := sql.Open("postgres", u.String())
	if err != nil {
		return errors.Wrap(err, "sql.Open")
	}

	_, err = db.Exec(fmt.Sprintf("CREATE DATABASE %s", dbName))
	if err != nil {
		// 42P04 -> duplicate_database error code
		if pqErr, ok := err.(*pq.Error); ok && pqErr.Code != "42P04" || !ok {
			return errors.Wrap(err, "db.Exec")
		}
	}

	return nil
}

type MigrationCommand struct {
	Path string
	Cmd  string
	Args string
	DSN  string
}

func (c MigrationCommand) Run() error {
	db, err := sql.Open("postgres", c.DSN)
	if err != nil {
		return err
	}

	log.Printf("Migrations: cmd=%q path=%q\n", c.Cmd, c.Path)
	goose.Status(db, c.Path)

	if err := goose.Run(c.Cmd, db, c.Path, c.Args); err != nil {
		return err
	}

	return nil
}

func main() {

	if len(os.Args) < 2 {
		// If command is not specified default to migrate
		os.Args = append(os.Args, "migrate")
	}

	var cmd Command

	switch os.Args[1] {
	case "create":
		createCmd.Parse(os.Args[2:])
	case "migrate":
		migrateCmd.Parse(os.Args[2:])
	default:
		migrateCmd.Parse(os.Args[2:])
	}

	if createCmd.Parsed() {
		cmd = &CreateCommand{
			DSN: *createDbDsn,
		}
	}

	if migrateCmd.Parsed() {
		cmd = &MigrationCommand{
			DSN:  *migrateDbDsn,
			Cmd:  *migrateCommand,
			Args: *migrateArgs,
			Path: *migratePath,
		}
	}

	if err := cmd.Run(); err != nil {
		log.Fatal(err)
	}

	log.Println("success")
}
