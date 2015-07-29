#!/usr/bin/env bash

apt-get update

apt-get install git -y

apt-get install wget curl build-essential -y

wget -qO- https://get.docker.com/ | sh

apt-get --purge remove node -y
apt-get --purge remove nodejs -y
apt-get install nodejs -y
apt-get install npm -y

sudo ln -s /usr/bin/nodejs /usr/bin/node

#git clone https://github.com/simplicityitself/microservicesux.git

apt-get autoremove -y

MUON_ENV = 'test'
MUON_CONFIG = 'test'
