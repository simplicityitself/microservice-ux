var muonCore = require("muon-core");
fs = require('fs');
require('sexylog');


process.env['LEVEL'] = 'trace';

var muonSystem = muonCore.generateMuon();

insert_projections(["listAllUsers.js", "listUserByID.js"], function(status) {
    if (! status) {
        throw new Error('error while inserting projects' + status);
    } else {
        //now after projections inserted, start user demo muon service...
        //startDemoUserService();
    }
});




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



function insert_projections(projections,clientCallback) {
    logger.info("insert_projection() inserting projections  ", projections);
    var callbackCount = 0;
    for (var i = 0 ; i < projections.length ; i++) {
        var inner_callback = function(result) {
            callbackCount++;
            logger.info("insert_projection() callbackCount=" + callbackCount + ", result=" + result);
            if (callbackCount == projections.length) {
                logger.info("insert_projection() all projections inserted. DONE!");
                clientCallback(true);
            }
        };
        insert_projection(projections[i], inner_callback)
    }
};



function insert_projection(projectionName, callback) {

    var filename = './projections/' + projectionName;
    logger.info("insert_projection() loading file: " + filename);
    fs.readFile(filename, 'utf8', function (err,data) {
      if (err) {
        logger.error(data);
      } else {
            projectionString = data;
            var projectionWrapper = {"projection-name" : projectionName,
                                   "stream-name" : "users" ,
                                   "language" : "javascript" ,
                                   "initial-value" : '{}' ,
                                   "filter" : "",
                                   "reduction" : projectionString};

             var photon_url = "";

             logger.info("insert_projection() inserting projection via muon: " + projectionName);
               //callback({event: {}, payload: {}});
             muonSystem.resource.command('muon://event-store/projections', projectionWrapper, function (event, payload){
                 logger.info("projection " + projectionName + " response status: ", event.Status);
                 if (event.Status == "404") {
                     callback(false);
                } else {
                     callback(true);
                }
                 callback({event: event, payload: payload});
             });

      }
    });



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
