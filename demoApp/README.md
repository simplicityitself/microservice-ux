# Microservices UX:  *The Microservices User eXperience*
## Simple Demo App

This app assumes that the Vagrant/Ansible Microservices platform has been deployed and is running.

npm install

cd build

node build_listAllUsers.js

cd ..

node app.js

Brings up a web REST API on 127.0.0.1:8080

Check the API is responding:
curl -X GET -H "Cache-Control: no-cache"  'http://127.0.0.1:8080/api/'
Should return "{"message":"Default API response!"}"

Run the following to insert a user
curl -X POST -H "Cache-Control: no-cache" -H 'http://127.0.0.1:8080/api/users/?fname=Charlie&lname=Brown&password=pass1'

And then open 127.0.0.1:3000/index.html - should see an entry under STREAMS for users. Click on it to expose the Charlie Brown user.

Add another user:
curl -X POST -H "Cache-Control: no-cache" -H 'http://127.0.0.1:8080/api/users/?fname=Peppermint&lname=Patty&password=chuck'

And see the new event added in the Photon web page.

Go to 127.0.0.1:3000/projection/UserList

Should see a JSON string with the users you have added, but the data has also be manipulated to show the fullname and a created username for each user added.
