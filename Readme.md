# Microservices UX:  *The Microservices User eXperience*

"Don't make me think!" - Steve Krug

"Make me think ... about what matters!" - The Microservices UX Team

Building, Deploying and Maintaining Polyglot Microservices is *hard*. This project makes it *simple* and *easy*.

By curating *best-of-breed infrastructure* and blending in a *coherent deployment and strong programming model*, Microservices UX helps you quickly *gain the benefits of Microservices without the hassle*.

## Your First Time with *Microservices UX*

It's never easy on your first time ... but we've done our best to make it as easy as possible to get up and running and using Microservices UX as quickly as possible.

### Prerequisites

To get up and running with Microserives UX you'll need the following tools installed:

* https://git-scm.com [GIT]
* https://www.vagrantup.com [Vagrant]
* A Virtualisation Provider such as https://www.virtualbox.org [VirtualBox] for Vagrant to use.



### Get the base platform running locally within a vagrant virtual machine

***Note! If you've already downloaded and run the microservices ux before, see the "Getting a new(er) version of the box" instructions at the end of this readme first.***

```bash
  mkdir muon-platform-demo
  cd muon-platform-demo
  vagrant box add muon-platform-demo https://microux.s3.amazonaws.com/muon-platform-demo-v2.box
  vagrant init muon-platform-demo
  vagrant up
```


### You're done! Time to Kick the tyres!

Navigate to the muon platform portal page to take a test drive around the platform's core services.

```
  http://localhost:8080/
```

### Now, try the HTTP<->Muon Gateway

See if the Gateway is running from your local machine:
```bash
curl -X GET -H "Cache-Control: no-cache"  'http://localhost:9001/'
```
or
```bash
curl -X GET -H "Cache-Control: no-cache"  'http://localhost:9001/discover'
```
If you get no response we'll need to start the gateway on the Vagrant box.

```bash
vagrant ssh
cd /home/vagrant/muon/mgateway
sudo forever start -l forever.log -a --uid "mgateway" gateway_v2.js
```
This will start the gateway as a forever daemon with logs going into the forever.log file. To stop the gateway use:
```bash
sudo forever stop mgateway
```

To check the gateway is working as expected:
```bash
vagrant ssh
cd /home/vag/muon/mgateway
mocha
```
This will run a series of tests that insert events and projections into the local Photon eventstore. *(F.Y.I. If the tests are re-run, some may fail as the tests assume an empty eventstore!)* Running other cURL commands on your local machine should now start to return user data.
```bash
curl -X GET -H "Cache-Control: no-cache" 'http://localhost:9001/photon/projection-keys'

curl -X GET -H "Cache-Control: no-cache" 'http://localhost:9001/photon/projection?projection-name=UserList'
```

### And there's more! Exploring using the Muon CLI

You can explore the current running services in overview using the muon command line interface:

```bash
  vagrant ssh
  root@muon-demo: sudo muon -d local discover

  Active Services
  -----------------------------------------------------------------------------------------
  name          url                  tags                             Muon Protocol Version
  ------------  -------------------  -------------------------------  ---------------------
  mgateway      muon://mgateway      my-tag,tck-service,muon-gateway  5
  photon        muon://photon        photon,helios                    5
  cli           muon://cli           cli,node

```

Or if you want more detail, hit:

```bash
  vagrant ssh
  root@muon-demo:sudo muon -d local -a discover
  
  Active Services
  -----------------------------------------------------------------------------------------
  name          url                  tags                             Muon Protocol Version
  ------------  -------------------  -------------------------------  ---------------------
  node-service  muon://node-service  my-tag,tck-service,node-service  5                    
  photon        muon://photon        photon,helios                    5                    
  cli           muon://cli           cli,node                                              

  Reactive Streams
  ------------------------------------------------
  Service Name  Stream Name  Url                  
  ------------  -----------  ---------------------
  photon        /stream      muon://photon//stream

  Query Endpoints
  -----------------------------------------------------------------------------
  Service Name  Endpoint Name             Url                                  
  ------------  ------------------------  -------------------------------------
  node-service  /muon/introspect          muon://node-service/muon/introspect  
  photon        /projection               muon://photon/projection             
  photon        /muon/introspect/stream   muon://photon/muon/introspect/stream 
  photon        /muon/introspect/command  muon://photon/muon/introspect/command
  photon        /projection-keys          muon://photon/projection-keys        
  photon        /muon/introspect          muon://photon/muon/introspect        
  photon        /muon/introspect/query    muon://photon/muon/introspect/query  

  Command Endpoints
  ------------------------------------------------------
  Service Name  Endpoint Name  Url                      
  ------------  -------------  -------------------------
  photon        /projections   muon://photon/projections
  photon        /events        muon://photon/events
  
```


### Photon Event Store

Check projection loaded in to photon:

```
 http://localhost:3000/projection-keys
```

### Simple DemoApp

See the demo application [README](https://github.com/simplicityitself/microservice-ux/blob/master/demoApp/README.md).


### Getting a new(er) version of the vagrant box

You must first remove the old version of the box as below, and then re-download:

```
vagrant box remove muon-platform-demo
vagrant box add muon-platform-demo https://microux.s3.amazonaws.com/muon-platform-demo.box
```
