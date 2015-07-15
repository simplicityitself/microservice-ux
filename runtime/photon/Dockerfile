FROM java:openjdk-8u45-jdk
wget --quiet https://github.com/technomancy/leiningen/releases/download/$LEIN_VERSION/leiningen-$LEIN_VERSION-standalone.zip \
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY ../photon/app-standalone.jar /usr/src/app
ENTRYPOINT ["java"]
CMD ["-jar", "app-standalone.jar"]

