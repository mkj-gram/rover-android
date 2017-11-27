package main

import (
	"database/sql"
	"flag"
	"fmt"
	"log"

	"github.com/pressly/goose"
)

var (
	pgdsn         = flag.String("pg-dsn", `postgres://postgres:postgres@localhost:5432/authsvc_dev?sslmode=disable`, "dev DSN")
	migrationsDir = flag.String("migrations-dir", "./db/migrations/postgres", "path to migrations")
)

func main() {
	flag.Parse()

	db, err := sql.Open("postgres", *pgdsn)
	if err != nil {
		log.Fatalln(err)
	}

	if err := goose.Status(db, *migrationsDir); err != nil {
		log.Fatalln(err)
	}

	if err := goose.Up(db, *migrationsDir); err != nil {
		log.Fatalln(err)
	}

	fmt.Println("Successfully migrated postgres")
}
