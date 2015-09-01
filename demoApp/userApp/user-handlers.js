
var uuid        = require('uuid');

exports.init = function(muon) {
    module.muon = muon;
};

exports.findUser = function (headers, data, respond) {
  logger.info("In find user");
  logger.info(data);

  var params = {};
  var myKey = null;
  var bProceed = false;

  //See if we have an id or username
  if(data.hasOwnProperty('ID') || (data.hasOwnProperty('id')) || data.hasOwnProperty('Id')) {
    //So we have an ID, use the listUsersByID projection
    params['projection-name'] = 'listUsersByID';
    params['id'] = data.id;

    logger.info(params);

    myKey     = data.id;
    bProceed  = true;

  }
  else if (data.hasOwnProperty('lastname') || data.hasOwnProperty('Lastname') || data.hasOwnProperty('LastName')) {
    //So we have a last name, use the listUsersByLastName projection
    params['projection-name'] = "listUsersByLastName";
    params['lastname'] = data.lastname;

    logger.info(params);

    myKey     = data.lastname;
    bProceed  = true;
  }
  else if (data.hasOwnProperty('username') || data.hasOwnProperty('Username') || data.hasOwnProperty('UserName')) {
    //So we have a user name, use the listUsersByUserName projection
    params['projection-name'] = "listUsersByUserName";
    params['username'] = data.username;

    logger.info(params);

    myKey     = data.username;
    bProceed  = true;
  }
  else {
    respond({message: "Sorry, wrong parameters passed"});
  }

  if(bProceed) {
    try{
      //query: url, callback, params
      module.muon.resource.query('muon://photon/projection', function(event, payload) {

        logger.info('-------------------------');
        logger.info(payload);
        logger.info('-------------------------');

        //Separate results if necessary
        if (payload.hasOwnProperty('current-value')) {
          thisPayload = payload['current-value'][myKey];
          respond({ message: 'Found user', info: thisPayload});
        }
        else {
          thisPayload = payload;
          respond({ message: 'Something is wrong', info: thisPayload});
        }


      }, params);
    }
    catch (e) {
      logger.warn("There was an error");
      logger.warn(e);
      respond({ message: 'There was an error', error: e});
    }
  }

};

exports.addUser = function(headers, data, respond) {

  logger.info("Add user event received");
  var users = data.payload;
  logger.info(users);

  for(var i=0;i<users.length;i++){

    var thisUser = users[i].user;

    logger.info("**************************************************************" , thisUser);

    if(thisUser.hasOwnProperty('fname') && thisUser.hasOwnProperty('lname')){

      //Add ID if required
      if(typeof thisUser.id == "undefined" || thisUser.id === null) {
        thisUser.id = uuid.v1();
      }

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
      module.muon.resource.command('muon://photon/events', thisEvent, function(event, payload) {
          logger.info('-------------------------');
          logger.info(payload);
          logger.info('-------------------------');

          if (payload.correct == 'true') {
            respond({ message: 'User ' + thisUser.fname + ' ' + thisUser.lname +' created!', userID: thisUser.id });
          }
          else {
            respond({ message: 'Error with Photon insert for user creation'});
          }
        }
      );
    }
    else {
      respond({ message: 'User not created!' });
    }

  }
};

exports.removeUser = function(headers, data, respond) {
  logger.info("Remove user event received");

  var thisUser = data.payload.user;
  logger.info(thisUser);

  if(thisUser.hasOwnProperty('fname') && thisUser.hasOwnProperty('lname')){

    //Create event for injection into EventStore
    var thisEvent = {
                  "service-id": "muon://photon/events",
                  "local-id": uuid.v4(),
                  "payload": {"user": {
                                        "id": thisUser.id,
                                        "first": thisUser.fname,
                                        "last": thisUser.lname,
                                        "password": thisUser.password,
                                        "active": thisUser.active,
                                        "Added": Date.now()}},
                  "stream-name": "users",
                  "server-timestamp": Date.now()
                };

    logger.info("Posting event to eventstore: ");

    //command: url, event, callback
    module.muon.resource.command('muon://photon/events', thisEvent, function(event, payload) {
        logger.info('-------------------------');
        logger.info(payload);
        logger.info('-------------------------');

        if (payload.correct == 'true') {
          respond({ message: 'User ' + thisUser.fname + ' ' + thisUser.lname +' updated!', active: thisUser.active });
        }
        else {
          respond({ message: 'Error with Photon insert for user update'});
        }
      }
    );
  }
  else {
    respond({ message: 'User not updated!' });
  }

};

exports.updateUser = function(headers, data, respond) {
  logger.info("Update user event received");

  var thisUser = data.payload.user;
  logger.info(thisUser);

  if(thisUser.hasOwnProperty('fname') && thisUser.hasOwnProperty('lname')){

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
    module.muon.resource.command('muon://photon/events', thisEvent, function(event, payload) {
        logger.info('-------------------------');
        logger.info(payload);
        logger.info('-------------------------');

        if (payload.correct == 'true') {
          respond({ message: 'User ' + thisUser.fname + ' ' + thisUser.lname +' updated!', userID: thisUser.id });
        }
        else {
          respond({ message: 'Error with Photon insert for user update'});
        }
      }
    );
  }
  else {
    respond({ message: 'User not updated!' });
  }
};

exports.loginUser = function(headers, data, respond) {

  logger.info("Login request received");
  logger.info(data.payload);

  var message = {};
  var login = {};

  login.username = data.payload.username;
  login.password = data.payload.password;
  login.success = false;

  logger.info(login);

  //Get user & check password
  var params = {"username" : login.username};

  module.muon.resource.query('muon://demoapp/find-user', function(event, payload) {

    logger.info(payload);

    if(payload.hasOwnProperty('info')) {

      if((payload.info.password == login.password) && (payload.info.active === true)) {
        login.success = true;
        message.message = "User " + login.username + " succcessfully logged in";
      }
      else if((payload.info.password == login.password) && (payload.info.active === false)) {
        message.message = "User " + login.username + " currently inactive. Login failed.";
      }
      else {
        message.message = "User " + login.username + " failed to login";
      }

      //record user login
      var loginEvent = {"login" :
                            {"username" : params.username,
                            "success": login.success,
                            "date" : Date.now()
                            }
                      };

      var thisEvent = {
                      "service-id": "muon://photon/events",
                      "local-id": uuid.v4(),
                      "payload": loginEvent,
                      "stream-name": "access",
                      "server-timestamp": Date.now()
                    };

      //command: url, event, callback
      module.muon.resource.command('muon://photon/events', thisEvent, function(event, payload) {
          logger.info('-------------------------');
          logger.info(payload);
          logger.info('-------------------------');

          if (payload.correct == 'true') {
            message['status'] = 'Login event recorded';
          }
          else {
            message['status'] = 'Error recording login event';
          }

          respond(message);
        }
      );

    }
    else {
       message.message = "Incorrect User details. Login failed.";
       respond(message);
    }

  }, params);

};

exports.logoutUser = function(headers, data, respond) {
  logger.info("In loginuser");
  logger.info(data);
    respond({
        message: "Login user"
    });
};

exports.showAllUsers = function(headers, data, respond) {
  logger.info("In list all users");
  logger.info(data);

  var params = {"projection-name": "listUsersByLastName"};

  try{
    //query: url, callback, params
    module.muon.resource.query('muon://photon/projection', function(event, payload) {

      logger.info('-------------------------');
      logger.info(payload);
      logger.info('-------------------------');

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
