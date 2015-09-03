# Microservices UX:  *The Microservices User eXperience*

## Simple Muon Demonstration User Service

### Installation & Setup

This app assumes that the Microservices platform has been deployed using Vagrant and you have checked out the demoApp code from GitHub into a local directory. We now need to build the projections for this App on the Photon Eventstore running on the Vagrant box. Go into the local vagrant folder and run:

```bash
vagrant ssh
./muon/muon-platform-reset.sh 
# wait 30 seconds...
cd muon/microservices-ux/demoApp
npm install 
node app.js 
```

Open another ssh shell int he vagrant parent directory for the demo box

```bash
vagrant ssh
cd muon/microservices-ux/demoApp
mocha

  Demo-user-service - Add User
    ✓ should correctly FAIL to add a user (4198ms)
    ✓ should correctly add a user (349ms)

  Demo-user-service - User manipulation
    ✓ should update a user (423ms)
    ✓ should remove a user (325ms)
    ✓ should fail gracefully when the wrong parameters are used to find a user (209ms)
    ✓ should return an empty object when there is no match in find a user (350ms)
    ✓ should find a user by username (331ms)
    ✓ should find a user by last name (329ms)
    ✓ should find a user by ID (325ms)

  Demo-user-service - Access control
    ✓ should login a user (663ms)
    ✓ should reject a bad password from a known user (666ms)
    ✓ should reject and notify login attempts from inactive or removed users (665ms)
    ✓ should reject login attempts from unknown users (545ms)
    - should show login activity between two dates


  13 passing (9s)
  1 pending

```

