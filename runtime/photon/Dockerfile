FROM java:openjdk-8u45-jdk
COPY photon/app-standalone.jar /
COPY config.properties /
ENTRYPOINT ["java"]
CMD ["-jar", "app-standalone.jar"]

