/*
* Checks to see if the projection exists in Photon.
* If not, it will use muon to send the create command to build it
*
* Author: NJW
* Date: 2015-07-16
*/

var muonCore = require("muon-core");
var events = require('events');
var debug = require("debug")("buildProjection");

var eventEmitter = new events.EventEmitter();

// configure app - should be from file or the environment
var myConfig = {};
  myConfig.amqp_server = 'amqp://muon:microservices@localhost:5672';
  myConfig.servicename = "demoapp";
  myConfig.eventstore = "photon";
  myConfig.useport = 3010;

var amqp = muonCore.amqpTransport(myConfig.amqp_server);

//Define TagCloudService muon instance for the communications to use
var muonSystem = muonCore.muon(myConfig.servicename, amqp.getDiscovery(), [
    ["my-tag", "tck-service", "node-service"]
]);

//Connect transport stream to the instance
muonSystem.addTransport(amqp);

//Get list of existing projections and add if required
muonSystem.resource.query('muon://'+ myConfig.eventstore +'/projection-keys', function(event, payload) {

  //Project name
  var projName = "UserList";

  checkProjection(projName,payload);

});

function checkProjection(projName, payload){

  //Simple flag
  var bProjectionExists = false;

  //extract projection names from payload
  var keyArray = payload['projection-keys'];

  if (keyArray.length > 0) {

    for (var i=0; i<keyArray.length; i++){

      var thisData = keyArray[i];

      debug(thisData);

      //check for matching name
      if (thisData == projName) {

        debug('Found a matching Projection');
        //change flag
        bProjectionExists = true;
        break;
      }
    }
  }

  if (!bProjectionExists) {
    debug('Projection is not defined, so define & build a new projection');

    // Fire the projection_required event
    eventEmitter.emit('projection_required');
  }
  else {
    eventEmitter.emit('finish');
  }
}

buildProjection = function(){

  var projName = "UserList";

  //actual projection reduction function
  var projString = "function eventHandler(state, event) {\r\n\r\n  var user = event.payload.user;\r\n\r\n  var key = user.last.replace(\/ \/g,\'\');\r\n\r\n  if (!(key in state)) {\r\n    state[key] = {};\r\n  }\r\n\r\n  state[key].id = user.id;\r\n  state[key].fullname = user.first + \' \' + user.last;\r\n\r\n  var username = null;\r\n\r\n  if(user.last.length > 8) {\r\n    username = (user.last.substring(0,7) + user.first.charAt(0)).toLowerCase();\r\n  }\r\n  else {\r\n    username = (user.last + user.first.charAt(0)).toLowerCase();\r\n  }\r\n\r\n  state[key].username = username.replace(\/ \/g,\'\');\r\n  state[key].first = user.first;\r\n  state[key].last = user.last;\r\n  state[key].password = user.password;\r\n\r\n  return state;\r\n}";

  //Define projection
  var projConf = {"projection-name" : projName,
                      "stream-name" : "users" ,
                      "language" : "javascript" ,
                      "initial-value" : '{}' ,
                      "filter" : "",
                      "reduction" : projString};

  //Now send the create projection command to Photon via Muon
  muonSystem.resource.command('muon://' + myConfig.eventstore + '/projections', projConf, function (event, payload){
    // Fire the projection_created event
    eventEmitter.emit('projection_created');
  });

};

eventEmitter.on('projection_required', buildProjection);

eventEmitter.on('projection_created', function(){
   debug('Created new projection');
   eventEmitter.emit('finish');
});

eventEmitter.on('finish', function(){
   debug('Finished');
   process.exit();
});
