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

main() {
  for cmd in $@; do
    $cmd
  done
}
