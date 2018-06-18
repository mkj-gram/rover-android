# Influx CLI

influx-cli is a influxdb migration tool. Manages influxdb by providing simple commands to create and apply migrations


# Usage
```text
Usage: influx-cli <command> [<args>]

command:
  create    Create an influx database
  migrate   Migrate an influx database applying migrations one by one
  

create:
    - dsn       The influxdb http dsn
    - db-name   The database name to create
    
migrate:
    - dsn       The influxdb http dsn. The path is treated as the database context to use
    - path      The directory to read migration files from
```