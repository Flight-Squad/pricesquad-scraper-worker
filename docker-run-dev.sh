#!/bin/bash

docker build --build-arg NPM_REG_CRED=${NPM_TOKEN} -t flight-squad/pricesquad-scraper-worker .
docker run -p 80:80 -e ENVKEY -e PORT -d flight-squad/pricesquad-scraper-worker
