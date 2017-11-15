# Audience Service

Responsible for managing Devices reported through the events-pipeline and Profiles through the bulk-api. This service also exposes an extensive and flexable query api to find segments. These segments can then be saved for future viewing and targetting messaging through the messages app.


### Developing

This project is run entirely on docker-compose using the following [file](https://github.com/RoverPlatform/rover/blob/master/docker/main.docker-compose.yaml) to bring up all database dependecies and locking in the go version to `1.9`. A `Makefile` is provided with the most common commands used to interact with the service


#### Running
Brings up dependecies and runs the audience-service in a throw away container. Usually used if are targetting the audience-service through your local machine
```bash
make run
```

#### Testing
Testing will test both Unit Tests and Full Integration Tests
```bash
make test
```

#### Shell
Boots into a shell session running `go-1.9` with all dependecies running and connected
```bash
make shell
```

#### Database
##### Seeding
Seed the mongodb database by using a production backup. The `ACCOUNT_ID` parameter should match the account id you've created in the `auth-service`. `DEVICES` represents the total count of devices to include
```bash
BACKUP_DIR=/path/to/production/mongo/backup ACCOUNT_ID=1 DEVICES=500 make db.seed
```
##### Resetting
Clears out all of mongodb and elasticsearch to start fresh again
```bash
make db.reset
```
##### Elasticsearch Re-Indexing
Calls the `elastic-cli` to run `index:create` and `index:populate` given an `ACCOUNT_ID`.
```bash
ACCOUNT_ID=1 make index
```
