package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/roverplatform/rover/audience/service/mongodb"
	"gopkg.in/mgo.v2"
	"log"
	"os"
)

var (
	verbose = flag.String("log-level", "info", "enable log level: info|trace|debug")

	stdout = log.New(os.Stdout, "", 0)
	stderr = log.New(os.Stderr, "", 0)
)

type command interface {
	FlagSet() *flag.FlagSet
	Run(context.Context) error
}

func main() {

	var (
		cmds = map[string]command{
			"up":   new(cmdUp),
			"down": new(cmdDown),
		}

		ctx, cancelFn = context.WithCancel(context.Background())
	)

	defer cancelFn()

	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage of %s: <cmd> <options...>", os.Args[0])
		flag.PrintDefaults()

		fmt.Fprintf(os.Stderr, "commands:\n")
		for k := range cmds {
			fmt.Fprintf(os.Stderr, "\t%s\n", k)
		}
	}

	flag.Parse()

	cmd, ok := cmds[flag.Arg(0)]
	if !ok {
		stderr.Println("unknown cmd:", flag.Arg(0))
		flag.Usage()
		os.Exit(1)
	}

	cmd.FlagSet().Parse(flag.Args()[1:])

	if err := cmd.Run(ctx); err != nil {
		stderr.Println("error:", err)
	}
}

func dialMongo(dsn string) (*mgo.Session, *mgo.DialInfo) {
	stdout.Println("Connecting to mongo")

	dialInfo, err := mongodb.ParseURL(dsn)
	if err != nil {
		stderr.Fatalln("mongodb:", err)
	}

	sess, err := mgo.DialWithInfo(dialInfo)
	if err != nil {
		stderr.Fatalf("mgo.Dial: DSN=%q error=%q", dsn, err)
	}

	stdout.Println("Connected to mongo")
	return sess, dialInfo
}
