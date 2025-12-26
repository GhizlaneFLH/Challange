#!/bin/bash

if [ "$1" == "build" ]; then
    docker-compose build
elif [ "$1" == "up" ]; then
    docker-compose up
elif [ "$1" == "down" ]; then
    docker-compose down
elif [ "$1" == "ingest" ]; then
    docker-compose run backend python main.py ingest
elif [ "$1" == "logs" ]; then
    docker-compose logs -f
else
    echo "Usage: ./docker.sh {build|up|down|ingest|logs}"
fi