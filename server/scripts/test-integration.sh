#!/bin/bash

# This script is made to run jest test integration but will confirm server
# health before starting. doing it in a script to avoid having to wrap a large
# number of jest tests in a before statement.

hasRun=false
for i in {0..10}
do
  echo "Getting server health via /healthcheck..."
  serverHealth=$(curl --write-out %{http_code} --silent --output /dev/null http://localhost:8080/healthcheck)
  echo "Server healthcheck returned..."$serverHealth

  if [ $serverHealth -eq 200 ]
  then
    hasRun=true
    jest tests/ --maxWorkers=4 --coverage
    break
  fi
  if [ $hasRun == false ]
  then
    echo "server didnt return status 200"
    echo "waiting for 5 seconds..."
   sleep 5
 fi
done

if [ $hasRun == false ]
then
 exit 1
else
  exit 0
fi
