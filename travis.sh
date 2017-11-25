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
fi

echo "Running $MODE on $COMPONENT..."
yarn "$MODE"
result=$?

if test ! -z "$pid"
then
  kill $pid
fi

exit $result
