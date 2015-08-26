
exports.init = function(muon) {
    module.muon = muon;
};

exports.findUser = function (headers, data, respond) {
    respond({
        message: "You great wazzock!"
    });
};

exports.addUser = function(headers, data, respond) {
  console.log("headers: " + headers);
  console.log("data: " + data);
  console.log("respond: " + respond);

  var users = data.payload;

  var callback = function(event, payload) {
    debug("Add user event received");
    debug('-------------------------');
    debug(event);
    debug('-------------------------');
    debug(payload);
    debug('-------------------------');

    if (payload.correct == 'true') {
      res.json({ message: 'User ' + user[i].fname + ' ' + user[i].lname +' created!', userID: user[i].id });
    }
    else {
      res.json({ message: 'Error with Photon insert for user creation'});
    }
  };

  for(var i=0;i<users.length;i++){

    if(user[i].hasOwnProperty('fname') && user[i].hasOwnProperty('lname')){
      //Add ID
      user[i].id = uuid.v1();

      //Create event for injection into EventStore
      var thisEvent = {
                    "service-id": "muon://" + myConfig.servicename,
                    "local-id": uuid.v4(),
                    "payload": {"user": {
                                          "id": user[i].id,
                                          "first": user[i].fname,
                                          "last": user[i].lname,
                                          "password": user[i].password,
                                          "Added": Date.now()}},
                    "stream-name": "users",
                    "server-timestamp": Date.now()
                  };

      debug("Posting event to eventstore: ");
      debug(thisEvent);

      //command: url, event, callback
      muonSystem.resource.command('muon://' + myConfig.eventstore + '/events', thisEvent, callback);
    }
    else {
      res.json({ message: 'User not created!' });
    }
  }
};

exports.removeUser = function(headers, data, respond) {

};

exports.updateUser = function(headers, data, respond) {

};

exports.loginUser = function(headers, data, respond) {

};

exports.showAllUsers = function(headers, data, respond) {

};
