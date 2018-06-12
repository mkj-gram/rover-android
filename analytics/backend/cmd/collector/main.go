package main

import (
	"log"
	"os"

	"github.com/namsral/flag"
)

var (
	influxdsn = flag.String("influxdb-dsn", "", "influx db connection string")
)

func main() {
	flag.Parse()

	log.Println("Implement Me")
	os.Exit(1)
}
