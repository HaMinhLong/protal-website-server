FROM node:16-alpine
MAINTAINER Walruship Co.,Ltd <contact@walruship.com>

RUN mkdir -p /var/www

COPY package*.json ./

WORKDIR /var/www

RUN npm install

COPY . .

EXPOSE 8080

CMD [ "npm", "run", "start" ]
