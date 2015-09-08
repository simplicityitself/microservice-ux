#!/bin/bash

mv node-v4.0.0-linux-x64.tar.gz /opt
cd /opt
tar xzf node-v4.0.0-linux-x64.tar.gz
mv /opt/node-v4.0.0-linux-x64 /opt/node
export PATH=$PATH:/opt/node/bin
npm install -g muon-core
