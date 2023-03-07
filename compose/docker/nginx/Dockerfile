FROM nginx:stable-alpine
MAINTAINER Walruship Co.,Ltd <contact@walruship.com>

RUN sed -i "s/user  nginx/user root/g" /etc/nginx/nginx.conf

RUN mkdir -p /var/www

WORKDIR /var/www
