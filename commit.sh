#!/bin/sh
if [ "x$1" != "x" ]; then
MESSAGE="$1"
else
MESSAGE="update project"
fi
if [ "x$2" != "x" ]; then
BRANCH="$2"
else
BRANCH="master"
fi
git add .
git commit -m "$MESSAGE"
git push origin $BRANCH
