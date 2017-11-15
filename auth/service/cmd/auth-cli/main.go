package main

import (
	"context"
	"database/sql"
	"flag"
	"fmt"
	"log"
	"os"

	auth "github.com/roverplatform/rover/apis/go/auth/v1"
	"github.com/roverplatform/rover/auth/service"
	"github.com/roverplatform/rover/auth/service/db/postgres"
)

var (
	pgdsn    = flag.String("pg-dsn", `postgres://postgres:postgres@localhost:5432/authsvc_dev?sslmode=disable`, "postgres DSN")
	name     = flag.String("name", "dev_user", "Username")
	password = flag.String("password", "password", "Password")
	email    = flag.String("email", "user@example.com", "Email")
	ctx      = context.Background()
)

func main() {
	flag.Parse()
	db, err := sql.Open("postgres", *pgdsn)
	if err != nil {
		log.Fatalf("sql.Open: %v", err)
	}
	defer db.Close()

	pgdb, err := postgres.Open(db)

	if err != nil {
		log.Fatalf("postgres.Open: %v", err)
	}

	s := service.Server{DB: pgdb}

	account, err := s.CreateAccount(ctx, &auth.CreateAccountRequest{
		Name: *name,
	})

	if err != nil {
		log.Fatalf("CreateAccount: %v", err)
	}

	tokens, err := s.ListTokens(ctx, &auth.ListTokensRequest{AccountId: account.GetId()})

	if err != nil {
		log.Fatalf("ListToken: %v", err)
	}

	_, err = s.CreateUser(ctx, &auth.CreateUserRequest{
		AccountId: account.GetId(),
		Name:      *name,
		Email:     *email,
		Password:  *password,
	})

	if err != nil {
		log.Fatalf("CreateUser: %v", err)
	}

	debugLogger := log.New(os.Stderr, "", 0)

	debugLogger.Printf("Account: %v \n", account.GetId())
	for _, token := range tokens.GetTokens() {
		for _, scope := range token.GetPermissionScopes() {
			debugLogger.Printf("Token: %v, Scope: %v\n", token.GetKey(), scope)
		}
	}

	// Need to pipe account id to ES index script
	fmt.Printf("%d", account.GetId())
}
