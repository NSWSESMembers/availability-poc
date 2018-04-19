#!/bin/sh

if test "$COMPONENT" == "server" -a "$CMD" == "test-integration"
then
  echo "Building server..."
  yarn run build

  echo "Starting server..."
  yarn run serve &

  # wait 10 seconds for the server to boot and load the test data
  # TODO: run the server in-process
  sleep 10
fi

echo "Running $CMD on $COMPONENT..."
yarn "$CMD"
result=$?

if test ! -z "$pid"
then
  kill $pid
fi

exit $result
