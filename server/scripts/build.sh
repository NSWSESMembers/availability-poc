#!/bin/bash

# This script is made to build a self-contained dist/ directory that contains
# a package.json ready for the nodejs buildpack on heroku but you could also
# run it elswhere by running: yarn && node main.js

rm -rf dist
mkdir dist

echo "Transpiling src with babel..."
babel src -d dist --ignore '__tests__'

for i in package.json yarn.lock Procfile
do
  echo "Copying metadata ($i)..."
  cp "$i" "dist/$i"
done
