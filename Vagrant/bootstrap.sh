#!/usr/bin/env bash

apt-get update
#apt-get upgrade -y
#apt-get dist-upgrade -y
#apt-get autoremove -y

#Get packages
apt-get install git wget curl build-essential -y

#Get docker
wget -qO- https://get.docker.com/ | sh

#Get NodeJS
apt-get --purge remove node -y
apt-get --purge remove nodejs -y
apt-get install nodejs -y
apt-get install npm -y

apt-get autoremove -y

sudo ln -s /usr/bin/nodejs /usr/bin/node

#Get Clojure
wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein
chmod +x lein
mv lein /usr/bin/

#Build directories and clone
mkdir muon
cd muon
git clone https://github.com/simplicityitself/microservice-ux.git
git clone http://github.com/photonevents/photon.git

#Install Muon-core
sudo npm install -g muon-core

#Install Java
echo debconf shared/accepted-oracle-license-v1-1 select true | sudo debconf-set-selections
echo debconf shared/accepted-oracle-license-v1-1 seen true | sudo debconf-set-selections
sudo add-apt-repository ppa:webupd8team/java -y
sudo apt-get update -y
sudo apt-get install oracle-java8-installer -y

#Setup Photon configs - now in Dockerfile
#cp /home/vagrant/muon/photon/resources/config.properties.vagrant /home/vagrant/muon/photon/resources/config.properties

sudo chown -R vagrant:vagrant /home/vagrant

#Build Photon
cd /home/vagrant/muon/photon/
sudo ./build.sh

#Build Photon in Docker
sudo docker build --tag=muon/photon .

#Start rabbitmq server
sudo docker run -d --hostname muonhost --name rabbit-muon -e RABBITMQ_DEFAULT_USER=muon -e RABBITMQ_DEFAULT_PASS=microservices -p 15672:15672 -p 5672:5672 rabbitmq:3.5.4-management

#Start Photon Docker - excludes the 10.0.2.15 & 172.17.42.1 IP addresses - should give you the actual IP address of the box
sudo docker run `for OUTPUT in $(hostname -I | grep -oE "\b(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\b" | egrep -v "10.0.2.15|172.17.42.1"); do echo "-e AMQP=$OUTPUT:5672 --add-host muonhost:$OUTPUT"; done;` --name "photon" -d "muon/photon"
