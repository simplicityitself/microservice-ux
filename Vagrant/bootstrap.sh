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

git clone https://github.com/simplicityitself/microservice-ux.git

sudo npm install -g muon-core

#muon setup
