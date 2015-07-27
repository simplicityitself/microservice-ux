FROM ubuntu

MAINTAINER Simplicity Itself

RUN apt-get update
RUN apt-get install -y wget expect file
RUN mkdir /applocal

COPY deploy.sh /applocal/deploy.sh

WORKDIR /applocal

RUN wget https://lattice.s3.amazonaws.com/releases/v0.2.3/linux-amd64/ltc

run chmod -R 777 .

CMD ./deploy.sh


