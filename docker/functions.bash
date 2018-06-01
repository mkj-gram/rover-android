#!/bin/sh

waiton() {
  local OPTS=$(set +o)
  set +e

  while :
  do
    nc -z $1 $2
    result=$?
    if [[ $result -eq 0 ]]; then
      break
    fi
    sleep 1
  done

  eval "$OPTS"
}

postgres_cli() {
  go run ./go/cmd/postgres-cli/*.go $@
}

main() {
  for cmd in $@; do
    $cmd
  done
}
