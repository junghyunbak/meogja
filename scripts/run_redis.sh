#!/bin/bash

docker run -d -p 6379:6379 --ip 172.17.0.2 --name redis-stack redis/redis-stack:lastest