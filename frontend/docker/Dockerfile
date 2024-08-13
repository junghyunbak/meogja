FROM node:18.17.1

WORKDIR /usr/src/app

COPY ../ ./

RUN npm i

EXPOSE 4173

CMD [ "npm", "run", "serve" ]