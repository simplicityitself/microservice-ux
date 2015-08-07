//************ Setup ************
// call the packages we need
var express    	= require('express');
var bodyParser 	= require('body-parser');
var muonCore		= require("muon-core");
var uuid        = require('uuid');

var debug			 	= require('debug')("mainApp");

// configure app - should be from file or the environment
var myConfig = {};
  myConfig.amqp_server = 'amqp://muon:microservices@localhost:5672';
  myConfig.servicename = "demoapp";
  myConfig.eventstore = "photon";
  myConfig.useport = 8080;

var app        	= express();
var port     		= myConfig.useport || 8080; // set our port

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

// on routes that end in /users
// ----------------------------------------------------
router.route('/users')

	// create a user (accessed via POST to http://localhost:8080/api/users?fname=name_1&lname=name_2&password=xxxxx)
	.post(function(req, res) {
		if(req.query.hasOwnProperty('fname') && req.query.hasOwnProperty('lname')) {
      var user = {};

			user.fname = req.query.fname;
      user.lname = req.query.lname;
			user.password = req.query.password;
      user.id = uuid.v1();

      //Create event for injection into EventStore
      var event = { "service-id": "muon://demoapp", "local-id": uuid.v4(), "payload": {"user": {"id": user.id, "first": user.fname, "last": user.lname, "password": user.password, "Added": Date.now()*1000}}, "stream-name": "users", "server-timestamp": Date.now()*1000 };

      debug("Posting event to eventstore:");
      debug(event);

      muonSystem.resource.command('muon://' + myConfig.eventstore + '/events', event, function(event, payload) {
        debug("Add user event received");
        debug(payload);

        if (payload.correct == 'true') {
          res.json({ message: 'User ' + user.fname + ' ' + user.lname +' created! (' + user.id + ')'});
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

	// get all the users (accessed via GET to http://localhost:8080/api/users)
	.get(function(req, res) {

    var params = {"projection-name" : projName, "from" : fromDate, "to" : "toDate"};

    //Do query to my end point - params in header!!!!
    muonClient.resource.query('muon://' + myConfig.eventstore + '/query?projection-name=' + projName, function(event, payload) {

      debug(payload);
      console.log("Return list of users from Photon");
  		res.json(payload);

    }, params);


		console.log("Return list of users from Photon");
		res.json({message: 'User list here'});

	});

// routes that end in /users/:user_id
router.route('/users/:user_id')

	// get the user with that id
	.get(function(req, res) {
			console.log('User with id ' + req.params.user_id + ' returned');
			res.json('User with id ' + req.params.user_id + ' returned');
	})

	// update the user with this id
	.put(function(req, res) {
		console.log('User with id ' + req.params.user_id + ' updated');
		res.json('User with id ' + req.params.user_id + ' updated');
	})

	// delete the user with this id
	.delete(function(req, res) {
		console.log('User with id ' + req.params.user_id + ' deleted');
		res.json('User with id ' + req.params.user_id + ' deleted');
	});


//************ Register the routes with the app ************
app.use('/api', router);

//************ Start everything running ************
app.listen(port);
console.log('The app is working now on port ' + port);
