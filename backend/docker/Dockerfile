FROM node:18.17.0

WORKDIR /usr/src/app

COPY ../.. .

WORKDIR /usr/src/app/backend

RUN npm i

EXPOSE 3002

CMD [ "npm", "run", "start" ]