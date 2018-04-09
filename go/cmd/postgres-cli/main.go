package main

import (
	"log"

	"database/sql"
	_ "github.com/lib/pq"

	"github.com/namsral/flag"
	"github.com/pressly/goose"
)

var migration struct {
	Path string
	Cmd  string
	Args string
	DSN  string
}

func main() {

	flag.StringVar(&migration.DSN, "db-dsn", ``, "db DSN")

	flag.StringVar(&migration.Path, "migration-path", ``, "path to migrations")
	flag.StringVar(&migration.Cmd, "migration-cmd", `up`, "migration cmd")
	flag.StringVar(&migration.Args, "migration-args", ``, "migration args")

	flag.Parse()

	db, err := sql.Open("postgres", migration.DSN)
	if err != nil {
		log.Fatalln("sql.Open", err)
	}

	log.Printf("Migrations: cmd=%q path=%q\n", migration.Cmd, migration.Path)
	goose.Status(db, migration.Path)

	if err := goose.Run(migration.Cmd, db, migration.Path, migration.Args); err != nil {
		log.Fatalln("goose.Run:", err)
	}
}
