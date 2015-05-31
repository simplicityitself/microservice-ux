FROM ubuntu:15.04

RUN apt-get update && apt-get install -y unzip && rm -rf /var/lib/apt/lists/*

ENV LANG C.UTF-8

ENV JAVA_VERSION 8u45

RUN set -x \
	&& apt-get update \
	&& apt-get install -yf \
		openjdk-8-jdk \
		ca-certificates-java \
	&& rm -rf /var/lib/apt/lists/*

RUN /var/lib/dpkg/info/ca-certificates-java.postinst configure
