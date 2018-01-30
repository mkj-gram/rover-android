package main

import (
	"log"

	_ "github.com/lib/pq"

	"github.com/namsral/flag"
	"github.com/pressly/goose"

	"github.com/roverplatform/rover/campaigns/db"
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

	pgdb, err := db.Open(migration.DSN)
	if err != nil {
		log.Fatalln("db.Open:", err)
	}

	log.Printf("Migrations: cmd=%q path=%q\n", migration.Cmd, migration.Path)
	goose.Status(pgdb.DB(), migration.Path)

	if err := goose.Run(migration.Cmd, pgdb.DB(), migration.Path, migration.Args); err != nil {
		log.Fatalln("goose.Run:", err)
	}
}
