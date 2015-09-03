# Microservices UX:  *The Microservices User eXperience*

## Simple Muon Demonstration User Service

### Installation & Setup

This app assumes that the Microservices platform has been deployed using Vagrant and you have checked out the demoApp code from GitHub into a local directory. We now need to build the projections for this App on the Photon Eventstore running on the Vagrant box. Go into the local vagrant folder and run:

```bash
vagrant ssh
cd muon/microservices-ux/demoApp
npm install 
node app.js 
```

Open another ssh shell int he vagrant parent directory for the demo box

```bash
vagrant ssh
mocha

  Demo-user-service - Add User
    ✓ should correctly FAIL to add a user (4202ms)
    ✓ should correctly add a user (354ms)

  Demo-user-service - User manipulation
    ✓ should update a user (466ms)
    ✓ should remove a user (330ms)
    ✓ should fail gracefully when the wrong parameters are used to find a user (210ms)
    ✓ should return an empty object when there is no match in find a user (335ms)
    ✓ should find a user by username (334ms)
    ✓ should find a user by last name (331ms)
    ✓ should find a user by ID (327ms)

  Demo-user-service - Access control
    ✓ should login a user (659ms)
    ✓ should reject a bad password from a known user (674ms)
    ✓ should reject and notify login attempts from inactive or removed users (669ms)
    ✓ should reject login attempts from unknown users (538ms)
```

