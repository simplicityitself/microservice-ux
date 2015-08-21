//************ Setup ************
// call the packages we need
var express     = require('express');
var bodyParser  = require('body-parser');
var muonCore		= require("muon-core");
var uuid        = require('uuid');

var debug       = require('debug')("mainApp");

// configure app - should be from file or the environment
var myConfig = {};
  myConfig.amqp_server  = 'amqp://muon:microservices@localhost:5672';
  myConfig.servicename  = "demoapp";
  myConfig.eventstore   = "photon";
  myConfig.useport      = 3010;   //Change this to 3020 if you want the app to run locally

var app     = express();
var port    = myConfig.useport || 3020; // set our port with 3020 fallback

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//************ Muon Start ************

//Configure Muon and AMQP
try{
  debug('Connecting to AMQP server - ' + myConfig.amqp_server);
  var amqp = muonCore.amqpTransport(myConfig.amqp_server);

  //Define muon instance for the communications to use
  var muonSystem = muonCore.muon(myConfig.servicename, amqp.getDiscovery(), [
      ["my-tag", "tck-service", "node-service"]
  ]);

  //Connect transport stream to the instance
  muonSystem.addTransport(amqp);
}
catch(err){
  debug('Could not connect to the AMQP server');
  debug(err);
}


//************ Start Routes ************
// create our router
var router = express.Router();

// middleware to use for all requests
router.use(function(req, res, next) {
	// do logging
	console.log('Something is happening.....');
	next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
	res.json({ message: 'Default API response!' });
});

// Code for all routes that end in /users
// ----------------------------------------------------
router.route('/users')

	// create a user (accessed via POST to http://localhost:port/api/users?fname=name_1&lname=name_2&password=xxxxx)
	.post(function(req, res) {

    var user = {};

		if(req.query.hasOwnProperty('fname') && req.query.hasOwnProperty('lname')) {
			user.fname = req.query.fname;
      user.lname = req.query.lname;
			user.password = req.query.password;
    }
    else if (req.body.hasOwnProperty('fname') && req.body.hasOwnProperty('lname')) {
      user.fname = req.body.fname;
      user.lname = req.body.lname;
      user.password = req.body.password;
    }

    if(user.hasOwnProperty('fname') && user.hasOwnProperty('lname')){
      //Add ID
      user.id = uuid.v1();

      //Create event for injection into EventStore
      var thisEvent = {
                    "service-id": "muon://" + myConfig.servicename,
                    "local-id": uuid.v4(),
                    "payload": {"user": {
                                          "id": user.id,
                                          "first": user.fname,
                                          "last": user.lname,
                                          "password": user.password,
                                          "Added": Date.now()}},
                    "stream-name": "users",
                    "server-timestamp": Date.now()
                  };

      debug("Posting event to eventstore: ");
      debug(thisEvent);

      //command: url, event, callback
      muonSystem.resource.command('muon://' + myConfig.eventstore + '/events', thisEvent, function(event, payload) {
        debug("Add user event received");
        debug('-------------------------');
        debug(event);
        debug('-------------------------');
        debug(payload);
        debug('-------------------------');

        if (payload.correct == 'true') {
          res.json({ message: 'User ' + user.fname + ' ' + user.lname +' created!', userID: user.id });
        }
        else {
          res.json({ message: 'Error with Photon insert for user creation'});
        }
      });

		}
		else {
			res.json({ message: 'User not created!' });
		}
	})

	// get all the users (accessed via GET to http://localhost:port/api/users)
	.get(function(req, res) {

    debug("Attempting to return a list of users");

    var projName = "UserList";
    var params = {"projection-name": projName};

    debug(params);

    try{
      //query: url, callback, params
      muonSystem.resource.query('muon://'+myConfig.eventstore+'/projection', function(event, payload) {

        debug('-------------------------');
        debug(event);
        debug('-------------------------');
        debug(payload);
        debug('-------------------------');
        debug("Returned a list of users from Photon");

        if (payload.hasOwnProperty('current-value')) {
          //Extract required Users from results
          var currentUsers = payload["current-value"];

          if (typeof currentUsers !== 'undefined'){
            res.json(currentUsers);
          }
          else {
            res.json({ message: 'No users found', issue: 'No users found' });
          }
        }
        else {
          res.json({ message: 'No users found', issue: 'Nothing returned' });
        }

      }, params);
    }
    catch (e) {
      debug("There was an error");
      debug(e);
    }

	});

// routes that end in /users/:user_id
router.route('/users/:user_id')

	// get the user with that id
	.get(function(req, res) {
			debug('User with id ' + req.params.user_id + ' requested');

			var projName = "UserInfo";
      var params = {"projection-name": projName, "user_id": req.params.user_id};

      debug(params);

      //query: url, callback, params
      muonSystem.resource.query('muon://'+myConfig.eventstore+'/projection', function(event, payload) {

        debug('-------------------------');
        debug(event);
        debug('-------------------------');
        debug(payload);
        debug('-------------------------');
        debug("Returned user info from Photon");

        //Extract required User from results
        if (payload.hasOwnProperty('current-value')) {
          var myUser = payload["current-value"][req.params.user_id];

          if (typeof myUser !== 'undefined'){
            res.json(myUser);
          }
          else {
            res.json({ message: 'No matching user found', issue: 'No such user' });
          }
        }
        else {
          res.json({ message: 'No matching user found', issue: 'Nothing returned' });
        }



      }, params);


	})

	// update the user with this id
	.put(function(req, res) {
		debug('User with id ' + req.params.user_id + ' updated');
		res.json('User with id ' + req.params.user_id + ' updated');
	})

	// delete the user with this id
	.delete(function(req, res) {
		debug('User with id ' + req.params.user_id + ' deleted');
		res.json('User with id ' + req.params.user_id + ' deleted');
	});


//************ Register the routes with the app ************
app.use('/api', router);

//************ Start everything running ************
app.listen(port);
console.log('The app is working now on port ' + port);
