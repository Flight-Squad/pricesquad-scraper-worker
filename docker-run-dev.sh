#!/bin/bash

docker build -t flight-squad/pricesquad-scraper-worker .
docker run -p 80:80 -e AWS_SECRET_ACCESS_KEY -e AWS_ACCESS_KEY_ID -e PRICESQUAD_API -d flight-squad/pricesquad-scraper-worker
