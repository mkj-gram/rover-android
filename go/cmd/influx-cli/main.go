package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	logger "log"
	"net/url"
	"os"
	"path/filepath"
	"time"

	"github.com/influxdata/influxdb/client/v2"
)

var (
	createCommand = flag.NewFlagSet("create", flag.ExitOnError)
	createDsn     = createCommand.String("dsn", "", "The influxdb connection string")
	createDBName  = createCommand.String("db-name", "", "The name of the database to create")

	migrateCommand = flag.NewFlagSet("migrate", flag.ExitOnError)
	migrateDsn     = migrateCommand.String("dsn", "", "The influxdb connection string")
	migratePath    = migrateCommand.String("path", "", "The path to load migrations")
)

var (
	log = logger.New(os.Stdout, "", 0)
)

func main() {
	if len(os.Args) == 1 {
		log.Println("usage: influx-cli <command> [<args]")
		log.Println("The most commonly used commands are: ")
		log.Println("create    Create an influx database")
		log.Println("migrate   Migrate an influx database")
		return
	}

	switch os.Args[1] {
	case "create":
		createCommand.Parse(os.Args[2:])
		runCreateCommand()
	case "migrate":
		migrateCommand.Parse(os.Args[2:])
		runMigrateCommand()
	default:
		log.Printf("%q is not a valid command.\n", os.Args[1])
		os.Exit(2)
	}
}

func runCreateCommand() {
	if *createDsn == "" || *createDBName == "" {
		log.Println("Missing required arguments")
		createCommand.PrintDefaults()
		os.Exit(2)
	}

	config, _, err := parseDsn(*createDsn)
	if err != nil {
		log.Fatalf("Failed to parse dsn: %s", err)
	}

	influx, err := client.NewHTTPClient(config)
	if err != nil {
		log.Fatalf("Failed to create influx client: %v", err)
	}
	defer influx.Close()

	command := fmt.Sprintf("CREATE DATABASE %q", *createDBName)
	if _, err := queryDB(influx, "", command); err != nil {
		log.Fatal(err)
	}
	log.Println("success")
}

type Migration struct {
	File      string
	Applied   bool
	AppliedAt *time.Time

	Command string
}

func runMigrateCommand() {
	if *migrateDsn == "" || *migratePath == "" {
		log.Println("Missing required arguments")
		migrateCommand.PrintDefaults()
		os.Exit(2)
	}

	var migrations []Migration

	err := filepath.Walk(*migratePath, func(path string, info os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if info.IsDir() {
			return nil
		}

		data, err := ioutil.ReadFile(path)
		if err != nil {
			return err
		}

		migrations = append(migrations, Migration{
			File:      info.Name(),
			Applied:   false,
			AppliedAt: nil,
			Command:   string(data),
		})

		return nil
	})
	if err != nil {
		log.Fatalln(err)
	}

	config, db, err := parseDsn(*migrateDsn)
	if err != nil {
		log.Fatalf("Failed to parse dsn: %s", err)
	}

	influx, err := client.NewHTTPClient(config)
	if err != nil {
		log.Fatalf("Failed to create influx client: %s", err)
	}
	defer influx.Close()

	if res, err := queryDB(influx, db, "select * from _migrations"); err != nil {
		log.Fatal(err)
	} else {

		if len(res) == 1 && len(res[0].Series) == 1 {
			// Loop through the values to check which migration has already been applied
			for _, row := range res[0].Series[0].Values {
				// we assume it has time, file if it exists then it was applied!
				var appliedAt, err = time.Parse(time.RFC3339, row[0].(string))
				if err != nil {
					log.Fatalln(err)

				}

				var filename = row[1].(string)

				for i := range migrations {
					if migrations[i].File == filename {
						migrations[i].Applied = true
						migrations[i].AppliedAt = &appliedAt
					}
				}
			}
		}

		// For each migration which has not yet been applied query and then insert into a _migrations measurement
		for _, migration := range migrations {
			if migration.Applied == true {
				continue
			}

			log.Printf("Applying migration: %s\n", migration.File)

			// now apply the command
			if _, err := queryDB(influx, db, migration.Command); err != nil {
				log.Fatalf("Failed to apply migration: %s, err: %s", migration.File, err)

			}

			bp, err := client.NewBatchPoints(client.BatchPointsConfig{
				Database:  db,
				Precision: "ns",
			})
			if err != nil {
				log.Fatalf("Failed to update migration tracker for migration: %s, err: %s", migration.File, err)

			}

			fields := map[string]interface{}{
				"file": migration.File,
			}

			pt, err := client.NewPoint(
				"_migrations",
				nil,
				fields,
				time.Now(),
			)
			if err != nil {
				log.Fatalf("Failed to update migration tracker for migration: %s, err %s", migration.File, err)

			}

			bp.AddPoint(pt)
			if err := influx.Write(bp); err != nil {
				log.Fatalf("Failed to write to migrations: %s, err: %s", migration.File, err)
			}
		}
		log.Println("success")
	}
}

//
// Helpers
//

func queryDB(clnt client.Client, db string, cmd string) ([]client.Result, error) {
	query := client.Query{
		Database: db,
		Command:  cmd,
	}
	if response, err := clnt.Query(query); err == nil {
		if response.Error() != nil {
			return nil, response.Error()
		}
		return response.Results, nil
	} else {
		return nil, err
	}

	return nil, nil
}

func parseDsn(dsn string) (client.HTTPConfig, string, error) {
	URL, err := url.Parse(dsn)
	if err != nil {
		return client.HTTPConfig{}, "", err
	}

	config := client.HTTPConfig{
		Addr: fmt.Sprintf("%s://%s", URL.Scheme, URL.Host),
	}

	if URL.User != nil {
		config.Username = URL.User.Username()
		if password, ok := URL.User.Password(); ok {
			config.Password = password
		}
	}

	var db = ""
	if URL.Path != "" {
		db = URL.Path[1:]
	}

	return config, db, nil
}
