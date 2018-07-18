#!/bin/bash
if [ -a sprc.pid ]
then
	pid=$(<sprc.pid);
fi
if [ -z $pid ]
then
	screen -mdS sprc node server.js;
	echo "Starting the server...";
	sleep 2;
fi

for var in "$@"
do
	arguments="$arguments $var"
done

node client.js $arguments