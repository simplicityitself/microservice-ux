


module.exports.insert_projection = function(name) {
    return function(callback, value) {

        RQ.sequence([
            function(callback) {
                var filename = './projections/' + projectionName;
                logger.info("insert_projection() loading file: " + filename);
                fs.readFile(filename, 'utf8', function (err, data) {
                    if (err) {
                        logger.error(data);
                    } else {
                        projectionString = data;
                        var projectionWrapper = {
                            "projection-name": projectionName,
                            "stream-name": "users",
                            "language": "javascript",
                            "initial-value": '{}',
                            "filter": "",
                            "reduction": projectionString
                        };

                        var photon_url = "";

                    }
                });
            }
        ]);

        logger.info("insert_projection() inserting projection via muon: " + projectionName);
        //callback({event: {}, payload: {}});
        muonSystem.resource.command('muon://eventstore/projections', projectionWrapper, function (event, payload) {
            logger.info("projection " + projectionName + " response status: ", event.Status);
            if (event.Status == "404") {
                callback(false);
            } else {
                callback(true);
            }
            callback({event: event, payload: payload});
        });

    }
};


