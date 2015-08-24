var muonCore = require("muon-core");
var UserHandlers = require("./userApp/user-handlers");
var projections = require("./userApp/projection-helper");
fs = require('fs');
require('sexylog');

process.env['LEVEL'] = 'trace';

var muonSystem = muonCore.generateMuon();
var handlers = new MuonHandlers(muonSystem);

RQ.sequence([
    RQ.parallel([
        projections.insert_projection("listAllUsers.js"),
        projections.insert_projection("listUserByID.js")
    ]),
    activateEndpoints
])({

});

function activateEndpoints(callback, value) {

    muonSystem.resource.onCommand('/add-user', handlers.addUser);
    muonSystem.resource.onCommand('/remove-user', handlers.removeUser);
    muonSystem.resource.onCommand('/update-user', handlers.updateUser);
    muonSystem.resource.onCommand('/login-user', handlers.loginUser);
    muonSystem.resource.onQuery('/find-user', handlers.findUser);
    muonSystem.resource.onQuery('/show-all-users', handlers.showAllUsers);
    //
    //muonSystem.resource.onQuery('/logins?from&to', function() {
    //
    //});


function startDemoUserService() {

    muonSystem.resource.onCommand('/add-user', function() {

    });

    muonSystem.resource.onCommand('/remove-user', function() {

    });

    muonSystem.resource.onCommand('/update-user', function() {

    });

    muonSystem.resource.onCommand('/login-user', function() {

    });

    muonSystem.resource.onQuery('/find-user', function() {

    });


    muonSystem.resource.onQuery('/show-all-users', function() {

    });

    muonSystem.resource.onQuery('/logins?from&to', function() {

    });

}

function insert_projection(projectionName) {

}

function check_projection(projectionName, callback) {
    // Not yet finished...
    muonSystem.resource.query('muon://'+ myConfig.eventstore +'/projection/' + projectionName, function(event, payload) {

           if (event.Status != 404 || event.Status != "404") {

                callback(true);
           } else {
                callback(false);
           }

    });

}
