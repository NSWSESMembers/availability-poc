#!/bin/bash

# This script is made to run check server health and exit with a status of 0
# if the server is up, otherwise exit with a status of 1 after trying 10 times.

hasRun=false
for i in {1..10}
do
  echo "Getting server health via /healthcheck... (Attempt "$i" of 10)"
  serverHealth=$(curl --write-out %{http_code} --silent --output /dev/null http://localhost:8080/healthcheck)
  echo "Server healthcheck returned..."$serverHealth

  if [ $serverHealth -eq 200 ]
  then
    echo "Server returned status 200"
    hasRun=true
    break
  fi
  if [ $hasRun == false ]
  then
    echo "Server didnt return status 200"
    echo "Waiting for 5 seconds..."
   sleep 5
 fi
done

if [ $hasRun == false ]
then
  echo "Giving up"
 exit 1
else
  echo "Success! existing."
  exit 0
fi
