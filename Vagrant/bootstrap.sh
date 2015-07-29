#!/usr/bin/env bash

apt-get update
#apt-get upgrade -y
#apt-get dist-upgrade -y
#apt-get autoremove -y

apt-get install git wget curl build-essential -y

wget -qO- https://get.docker.com/ | sh

apt-get --purge remove node -y
apt-get --purge remove nodejs -y
apt-get install nodejs -y
apt-get install npm -y

apt-get autoremove -y

sudo ln -s /usr/bin/nodejs /usr/bin/node

wget https://raw.githubusercontent.com/technomancy/leiningen/stable/bin/lein
chmod +x lein
mv lein /usr/bin/

mkdir muon
cd muon
git clone https://github.com/simplicityitself/microservice-ux.git
git clone http://github.com/photonevents/photon.git

sudo npm install -g muon-core



echo debconf shared/accepted-oracle-license-v1-1 select true | sudo debconf-set-selections
echo debconf shared/accepted-oracle-license-v1-1 seen true | sudo debconf-set-selections
sudo add-apt-repository ppa:webupd8team/java -y
sudo apt-get update -y
sudo apt-get install oracle-java8-installer -y


sudo chown -R vagrant:vagrant /home/vagrant

#muon setup
