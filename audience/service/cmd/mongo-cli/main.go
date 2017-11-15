package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"golang.org/x/net/context"
)

var (
	verbose = flag.String("log-level", "info", "enable log level: info|trace|debug")

	stdout = log.New(os.Stdout, "", 0)
	stderr = log.New(os.Stderr, "", 0)
)

func main() {

	var (
		cmds = map[string]command{
			"mongo:clear": new(cmdMongoClear),
			"mongo:seed":  new(cmdMongoSeed),
			"mongo:reset": new(cmdMongoReset),
		}

		ctx, cancelFn = context.WithCancel(context.Background())
	)

	defer cancelFn()

	flag.Usage = func() {
		fmt.Fprintf(os.Stderr, "Usage of %s: <cmd> <options...>", os.Args[0])
		flag.PrintDefaults()

		fmt.Fprintf(os.Stderr, "commands:\n")
		for k, _ := range cmds {
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

type command interface {
	FlagSet() *flag.FlagSet
	Run(context.Context) error
}
