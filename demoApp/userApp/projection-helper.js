
var RQ = require("async-rq");

module.exports.init = function(muon) {
    module.muonSystem = muon;
};

module.exports.install_list_user_by_id = function(callback, value) {
    projection_check_and_install("listUserByID.js", callback);
};

module.exports.install_list_users_projection = function(callback, value) {
    projection_check_and_install("listAllUsers.js", callback);
};

function projection_check_and_install(projectionName, callback) {

    var workflow = RQ.sequence([
        check_projection,
        install_projection
    ]);

    workflow(function (data) {
        logger.info("Completed installation of " + projectionName);
        callback();
    }, {
        projectionName: projectionName,
        projectionExists: false
    })
}

function install_projection(callback, value) {
    if (value.projectionExists) {
        return callback(value);
    }
    var filename = './projections/' + value.projectionName;
    logger.info("insert_projection() loading file: " + filename);

    try {
        var projectionString = fs.readFileSync(filename, 'utf8');
        var projectionWrapper = {
            "projection-name": value.projectionName,
            "stream-name": "users",
            "language": "javascript",
            "initial-value": '{}',
            "filter": "",
            "reduction": projectionString
        };

        logger.info("insert_projection() inserting projection via muon: " + value.projectionName);
        //callback({event: {}, payload: {}});
        module.muonSystem.resource.command('muon://eventstore/projections', projectionWrapper, function (event, payload) {
            logger.info("projection " + value.projectionName + " response status: ", event.Status);
            //if (event.Status == "404") {
            //    callback(false);
            //} else {
            //    callback(true);
            //}
            callback({event: event, payload: payload});
        });

    } catch(e) {
        logger.error(e);
    }
}

function check_projection(callback, value) {
    // Not yet finished...
    module.muonSystem.resource.query('muon://eventstore/projection/' + value.projectionName, function(event, payload) {
        if (event.Status != 404 || event.Status != "404") {
            logger.info("Projection " + value.projectionName + "already exists in the photon");
            value.projectionExists = true;
        } else {
            logger.info("Projection " + value.projectionName + " doesn't exist in the photon, needs to be installed");
            value.projectionExists = false;
        }
        callback(value);
    });
    return function cancel(message) {
        logger.warn("Attempting to cancel an operation " + message);
    }
}