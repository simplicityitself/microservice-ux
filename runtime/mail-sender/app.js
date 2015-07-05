/**
 * A simple MTA shim for muon
 *
 * Needs serious configuration love
 */

var muonCore = require('muon-core');
var muon = muonCore.muon('mailer');
var config = require('./config');
var mailer = require('./lib/mailer.js');

muon.addTransport(muonCore.amqpTransport);

var events = [];

muon.onPost("/email", "Post e-mail to a user", function(event, data, respond) {
    var res;

    mailer.email(config.email, JSON.parse(data.toString())).send(function(info) {
        // success
        console.log('We have a success');
        console.dir(info);
        respond({success: true, response: info.response, rejected: info.rejected});
    }, function (error, info) {

        respond({failure: true, failed: error});
    });




});