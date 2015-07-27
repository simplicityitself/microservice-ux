FROM java:openjdk-8u45-jdk
COPY photon/app-standalone.jar /
COPY config.properties /
RUN mkdir /logs
RUN touch /logs/localevents.json
RUN chmod 666 /logs/localevents.json
ENTRYPOINT ["java"]
CMD ["-jar", "app-standalone.jar"]

