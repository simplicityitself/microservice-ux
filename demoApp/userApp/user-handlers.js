
exports.init = function(muon) {
    module.muon = muon;
};

exports.findUser = function (headers, data, respond) {
    logger.info("In find user");
    logger.info(data);
    respond({
        message: "Find user!"
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
  logger.info("In remove user");
  logger.info(data);
    respond({
        message: "Remove user"
    });
};

exports.updateUser = function(headers, data, respond) {
  logger.info("In update user");
  logger.info(data);
    respond({
        message: "Update user"
    });
};

exports.loginUser = function(headers, data, respond) {
  logger.info("In loginuser");
  logger.info(data);
    respond({
        message: "Login user"
    });
};

exports.showAllUsers = function(headers, data, respond) {
  logger.info("In list all users");
  logger.info(data);

  var params = {"projection-name": "listAllUsers"};

  try{
    //query: url, callback, params
    module.muon.resource.query('muon://photon/projection', function(event, payload) {

      logger.info('-------------------------');
      logger.info(event);
      logger.info('-------------------------');
      logger.info(payload);
      logger.info('-------------------------');
      logger.info("Returned something from Service endpoint");

      //Separate results if necessary
      if (payload.hasOwnProperty('current-value')) {
        thisPayload = payload['current-value'];
      }
      else {
        thisPayload = payload;
      }

      respond({ message: 'showAllUsers response', info: thisPayload});

    }, params);
  }
  catch (e) {
    logger.warn("There was an error");
    logger.warn(e);
    respond({ message: 'There was an error', error: e});
  }










};
