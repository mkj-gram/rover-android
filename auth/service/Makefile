DB_DSN ?= "postgres://postgres:@postgres:5432/authsvc_test?sslmode=disable"

test:
	docker-compose exec auth-service go test -tags integration -v ./auth/service/... --service.DSN=${DB_DSN}
