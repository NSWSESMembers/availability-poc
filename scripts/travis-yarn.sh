#!/bin/sh

if test "$COMPONENT" == "server" -a "$CMD" == "test-integration"
then
  echo "Building server..."
  yarn run build

  echo "Starting server..."
  yarn run serve &
fi

echo "Running $CMD on $COMPONENT..."
yarn "$CMD"
result=$?

if test ! -z "$pid"
then
  kill $pid
fi

exit $result
