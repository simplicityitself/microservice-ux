FROM java:openjdk-8u45-jdk
COPY photon/app-standalone.jar /
COPY config.properties /
RUN mkdir /logs
RUN touch /logs/events.json
RUN chmod -R 666 /logs/
ENTRYPOINT ["java"]
CMD ["-jar", "app-standalone.jar"]

