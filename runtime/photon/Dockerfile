FROM java:openjdk-8u45-jdk
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY photon/app-standalone.jar /usr/src/app
ENTRYPOINT ["java"]
CMD ["-jar", "app-standalone.jar"]

