# Microservices UX:  *The Microservices User eXperience*
## Simple Demo App

### Installation & Setup
This app assumes that the Microservices platform has been deployed using Vagrant and you have checked out the demoApp code from GitHub into a local directory. We now need to build the projections for this App on the Photon Eventstore running on the Vagrant box. Go into the local demoApp folder and run:

```bash
npm install
```
to install the NodeJS dependancies.

Projections can be created in three different ways: you can build them programmatically, via the Photon web interface or by using cURL. In this example we will deploy the projections programmatically. From the demoApp folder change to the build directory and run the two build_ files.

```bash
cd build

DEBUG=* node build_listAllUsers.js
DEBUG=* node build_listUserByID.js
```
This will check to see if a projection with a matching name exists. If it does not, the script will create one. If the projection exists the process will end. By default creating a projection with a duplicate name will cause the existing projection to be overwritten.

### Running the App

We have now deployed the projections onto the Eventstore and are ready to start the app. In the demoApp folder (NOT the /build folder!!) start the app by using

```bash
node app.js
```

Alternatively, if you want the full debug output start the app using
```bash
export LEVEL=debug
DEBUG=* node app.js
```

### Testing the App - Add Users

The app should start and make a web addressable REST API available on http://localhost:3020/api. Open another terminal window and check to see that the API is responding:
```bash
curl -X GET -H "Cache-Control: no-cache"  'http://localhost:3020/api/'
```
If it is all working as expected it should return
```bash
{"message":"Default API response!"}
```

To insert a new user we post the information to the API. The following will insert a user named Charlie Brown.
```bash
curl -X POST -H "Cache-Control: no-cache" 'http://localhost:3020/api/users/?fname=Charlie&lname=Brown&password=peanuts'
```
The new user will be inserted - you can now open the Photon web page at http://localhost:3000/index.html in a browser and see a link under STREAMS called users. Click on it to expand and display the last five 'events' added to the Eventstore. In this case there should be only one - the  user you just created.

Go back to the terminal and add another user:
```bash
curl -X POST -H "Cache-Control: no-cache" 'http://localhost:3020/api/users/?fname=Peppermint&lname=Patty&password=chuck'
```
As before we can see the new user 'event' added in the user stream on the Photon web page.

### Testing the App - Query The Eventstore

Now if you go to the Photon web page for the UserList Projection (http://localhost:3000/projection/UserList) in a browser, you should see a JSON string with the users you have added. Notice that the information has been modified as part of the projection to insert additional information in the form of a fullname and a username for each user added.

You can also try going to http://localhost:3000/projection/UserInfo in a browser, you should see a JSON string with the users you have added but now indexed by ID rather than last name.

To see all users in the system via the API:
```bash
curl -X GET -H "Cache-Control: no-cache"  'http://localhost:3020/api/users'
```

To retrieve a specific user via the API copy the UUID from the User ID field and pass it into the API
```bash
curl -X GET -H "Cache-Control: no-cache" 'http://localhost:3020/api/users/xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
```

For best results try using Postman to test the API - https://www.getpostman.com/  
