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
  myConfig.useport = 8080;

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

      //check for matching name
      if (thisData.sym.name == projName) {

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
}

buildProjection = function(){

  var projName = "UserList";

  //actual projection reduction function
  var projString = "function eventHandler(state, event) {  var user = event.payload.user;  if (!(user.last in state)) {state[user.last] = {};  }  state[user.last].id = user.id;  state[user.last].fullname = user.first + \' \' + user.last;  if(user.last.length > 8) {state[user.last].username = (user.last.substring + user.first.charAt(0)).toLowerCase();  }  state[user.last].username = (user.last + user.first.charAt(0)).toLowerCase();  state[user.last].password = user.password;  state[user.last].logins = [];  return state;}";

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
});
