FROM quay.io:simplicityitself:microux-base

MAINTAINER Simplicity Itself

RUN apt-get install -y netcat
RUN mkdir /applocal
RUN curl -s get.gvmtool.net | bash
RUN chmod 755 ~/.gvm/bin/gvm-init.sh

COPY logsink.sh /applocal/
COPY logparse.groovy /applocal/
COPY firehose_sample /applocal/

run mkdir /applocal/applocal

WORKDIR /applocal
run chmod -R 777 /applocal

CMD /applocal/logsink.sh

