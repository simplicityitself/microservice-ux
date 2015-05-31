FROM quay.io/simplicityitself/microux-base

MAINTAINER Simplicity Itself


RUN apt-get update
RUN apt-get install -y netcat-openbsd curl wget
RUN mkdir /applocal

WORKDIR /applocal

RUN wget http://dl.bintray.com/groovy/maven/groovy-binary-2.4.3.zip
RUN unzip groovy-binary-2.4.3.zip

COPY logsink.sh /applocal/
COPY logparse.groovy /applocal/
COPY firehose_sample /applocal/

run mkdir /applocal/applocal

run chmod -R 777 /applocal

CMD /applocal/logsink.sh

