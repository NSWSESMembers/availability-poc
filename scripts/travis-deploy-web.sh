#!/bin/sh

pip install --user awscli

alias aws=~/.local/bin/aws

aws --version

aws s3 sync dist s3://callout.nsws.es --delete
