
var uuid        = require('uuid');

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

  logger.info("Add user event received");
  var users = data.payload;
  logger.info(users);

  var callback = function(event, payload) {
    logger.info('-------------------------');
    logger.info(payload);
    logger.info('-------------------------');

    if (payload.correct == 'true') {
      respond({ message: 'User created!'});
    }
    else {
      respond({ message: 'Error with Photon insert for user creation'});
    }
  };

  for(var i=0;i<users.length;i++){

    var thisUser = users[i].user;

    if(thisUser.hasOwnProperty('fname') && thisUser.hasOwnProperty('lname')){
      //Add ID
      thisUser.id = uuid.v1();

      //Create event for injection into EventStore
      var thisEvent = {
                    "service-id": "muon://photon/events",
                    "local-id": uuid.v4(),
                    "payload": {"user": {
                                          "id": thisUser.id,
                                          "first": thisUser.fname,
                                          "last": thisUser.lname,
                                          "password": thisUser.password,
                                          "active": true,
                                          "Added": Date.now()}},
                    "stream-name": "users",
                    "server-timestamp": Date.now()
                  };

      logger.info("Posting event to eventstore: ");

      //command: url, event, callback
      module.muon.resource.command('muon://photon/events', thisEvent, callback);
    }
    else {
      respond({ message: 'User not created!' });
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
