FROM node:18.17.0

WORKDIR /usr/src/app

COPY ../.. ./

WORKDIR /usr/src/app/frontend

RUN npm i

EXPOSE 4173

CMD [ "npm", "run", "serve" ]