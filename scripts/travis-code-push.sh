#!/bin/sh

code-push login --accessKey "$CODE_PUSH_ACCESS_KEY"
code-push release-react "availability-poc-$PLATFORM" "$PLATFORM"
code-push logout
