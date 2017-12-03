#!/bin/sh

echo "Changing to $COMPONENT..."
cd "$COMPONENT"

echo "Installing dependencies for $COMPONENT..."
yarn

if test "$COMPONENT" == "server" -a "$MODE" == "test"
then
  echo "Building server..."
  yarn run build

  echo "Starting server..."
  yarn run serve &

  # wait 10 seconds for the server to boot and load the test data
  # TODO: run the server in-process
  sleep 10
fi

echo "Running $MODE on $COMPONENT..."
yarn "$MODE"
result=$?

if test ! -z "$pid"
then
  kill $pid
fi

exit $result
