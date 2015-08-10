# Microservices UX:  *The Microservices User eXperience*
## Simple Demo App

This app assumes that the Vagrant/Ansible Microservices platform has been deployed and is running. You need to connect to the Vagrant box via

```bash
vagrant ssh
```

Once in we need to setup the demo app: this means installing the NodeJS dependancies and deploying the UserList projection into the Photon eventstore.

```bash
cd /home/vagrant/muon/microservice-ux/demoApp

npm install

cd build

node build_listAllUsers.js
node build_listUserByID.js
```
Now run the app
```bash
cd ..

node app.js
```

Alternatively, if you want the full debug output start the app
```bash
cd..

export LEVEL=debug
DEBUG=* node app.js
```

The app should start and bring up a web addressable REST API on localhost:3010. Logout of the vagrant box and in your local terminal check to see that the API is responding:
```bash
curl -X GET -H "Cache-Control: no-cache"  'http://127.0.0.1:3010/api/'
```
If it is all working as expected it should return "{"message":"Default API response!"}"

Run the following to insert a user
```bash
curl -X POST -H "Cache-Control: no-cache" -H 'http://127.0.0.1:3010/api/users/?fname=Charlie&lname=Brown&password=pass1'
```

And then open local:3000/index.html ina browser and you should see an entry under STREAMS for users. Click on it to expand the Charlie Brown user.

Add another user:
```bash
curl -X POST -H "Cache-Control: no-cache" -H 'http://127.0.0.1:3010/api/users/?fname=Peppermint&lname=Patty&password=chuck'
```
And see the new event added in the user stream on the Photon web page.

Now if you go to localhost:3000/projection/UserList in a browser, you should see a JSON string with the users you have added. Notice that the projection has been manipulated to produce a fullname and a created username for each user added.

You can also try going to localhost:3000/projection/UserInfo in a browser, you should see a JSON string with the users you have added but now sorted by ID rather than last name.

For best results try using Postman to test the API - https://www.getpostman.com/  
