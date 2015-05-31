FROM java:openjdk-8u45-jdk

MAINTAINER Simplicity Itself

RUN apt-get update && apt-get install -y netcat
RUN mkdir /applocal
RUN curl -s get.gvmtool.net | bash
RUN chmod 755 ~/.gvm/bin/gvm-init.sh

COPY * /applocal/

run mkdir /applocal/applocal

WORKDIR /applocal
run chmod -R 777 /applocal

CMD /applocal/logsink.sh

