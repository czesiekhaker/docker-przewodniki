FROM nginx
MAINTAINER "Michał 'czesiek' Czyżewski" <czesiek@hackerspace.pl>

COPY public/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

#CMD 'nginx'
