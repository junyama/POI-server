#!/bin/sh

export PROJECT_ROOT=/home/junichi/github/POI-server/
DB_FILE_NAME=$1
SERVER_PORT=$2
if [ -z "$1" ]; then DB_FILE_NAME=db.sqlite
fi
if [ -z "$2" ]; then SERVER_PORT=8000
fi
echo "DB_FILE_NAME = " $DB_FILE_NAME
echo "SERVER_PORT = " $SERVER_PORT
export DB_FILE_NAME
export SERVER_IP=`hostname -I | cut -f1 -d' '`
export SERVER_PORT

cd $PROJECT_ROOT
build/poi-exe
