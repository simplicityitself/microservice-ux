/**
 * A simple MTA shim for muon
 *
 * Needs serious configuration love
 */

var muonCore = require("./index.js");

var amqp = muonCore.amqpTransport("amqp://localhost:5672");
var muon = muonCore.muon('tck', amqp.getDiscovery(), [
    "gateway", "email", "node"
]);
muon.addTransport(amqp);
var events = [];

muon.resource.onCommand("/email", "Post email to a user", function(event, data, respond) {
    var res;

    mailer.email(config.email, data).send(function(info) {
        // success
        console.log('We have a success');
        console.dir(info);
        respond({success: true, response: info.response, rejected: info.rejected});
    }, function (error, info) {

        respond({failure: true, failed: error});
    });
});