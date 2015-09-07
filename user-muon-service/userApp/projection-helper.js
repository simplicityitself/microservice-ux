
var RQ = require("async-rq");

module.exports.init = function(muon) {
    module.muonSystem = muon;
};

module.exports.install_list_users_by_id = function(callback, value) {
    logger.info("listUsersByID projection init");
    projection_check_and_install("listUsersByID", callback);
};

module.exports.install_list_users_by_lastname = function(callback, value) {
    logger.info("listUsersByLastName projection init");
    projection_check_and_install("listUsersByLastName", callback);
};

module.exports.install_list_users_by_username = function(callback, value) {
    logger.info("listUsersByUserName projection init");
    projection_check_and_install("listUsersByUserName", callback);
};

function projection_check_and_install(projectionName, callback) {
    logger.info("Starting installation of " + projectionName);

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
    });
}

function install_projection(callback, value) {

    //Needs fixing - ALWAYS installs projections - as value above in 'workflow()' is never overwritten
    logger.info(value.projectionExists);

    if (value.projectionExists === true) {
        logger.info("Projection " + value.projectionName + ' exists. Ending.');
        return callback(value);
    }
    else {

        var filename = './projections/' + value.projectionName + '.js';

        logger.info("Installing " + value.projectionName);
        logger.info('++++++++++++++++++++++++++++++++');
        logger.info(value);
        logger.info('++++++++++++++++++++++++++++++++');
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
            module.muonSystem.command('muon://photon/projections', projectionWrapper, function (event, payload) {
                logger.info("projection " + value.projectionName + " response status: ", event.Status);

                callback({event: event, payload: payload});
            });

        } catch(e) {
            logger.error(e);
        }
    }
}

function check_projection(callback, value) {

    logger.info("Checking for " + value.projectionName);

    var params = {"projection-name": value.projectionName};

    module.muonSystem.query('muon://photon/projection', function(event, payload) {

        if (payload === null) {
            logger.info("Projection " + value.projectionName + " doesn't exist in the photon, needs to be installed");
            value.projectionExists = false;
        } else {
            logger.info("Projection " + value.projectionName + " already exists in the photon");
            value.projectionExists = true;
        }

        callback(value);

    }, params);

    return function cancel(message) {
        logger.warn("Attempting to cancel an operation " + message);
    };
}