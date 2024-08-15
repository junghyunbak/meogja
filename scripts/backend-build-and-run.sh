#!/bin/bash

cd ./backend

npm install

npx pm2 kill

npm run start:prod