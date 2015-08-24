var muonCore = require("muon-core");

require('sexylog');
assert = require('assert');

var muon = muonCore.generateMuon();

describe('Demo-user-service test', function () {

    before(function(done) {
        muon.onReady(function() {

            done();
        });
    });

    it('injects expected projections', function (done) {
        // use muon to view inserted projections in eventstore
        muon.resource.query('muon://eventsotre/projection/blah-name', function (event, payload) {
            // ok assert what you expect here:
            assert(event.Status != '404');
            assert(payload);
            done();
        });
    });

    it('adds user', function (done) {
        // add 5 users here
        var user1 = {};
        muon.resource.command('muon:/demoapp/add-user', function (event, payload) {
            // ok assert what you expect here:
            assert(event.Status != '404');
            assert(payload);
            done();
        });
    });

    it('updates user', function (done) {
        //update one of the 5 users here
        var newUser1 = {};
        muon.resource.command('muon:/demoapp/update-user', function (event, payload) {
            // ok assert what you expect here:
            assert(event.Status != '404');
            assert(payload);
            done();
        });
    });

    it('removes user', function (done) {
        // remove a user here
        var userId = "x";
        muon.resource.command('muon:/demoapp/remove-user?id=' + userId, function (event, payload) {
            // ok assert what you expect here:
            assert(event.Status != '404');
            assert(payload);
            done();
        });
    });

    it('login a user', function (done) {
        // login one of the users several times
    });

    it('finds a user', function (done) {
        // fidn one of the five users
        var userId = "x";
        muon.resource.query('muon:/demoapp/find-user?id=' + userId, function (event, payload) {
            // ok assert what you expect here:
            assert(event.Status != '404');
            assert(payload);
            done();
        });
    });

    it('show all users', function (done) {
        // show all users
        muon.resource.query('muon:/demoapp/show-all-users', function (event, payload) {
            // ok assert what you expect here:
            assert(event.Status != '404');
            assert(payload);
            done();
        });
    });

    it('show logins between x date and y date', function (done) {
        // show all logins
        muon.resource.query('muon:/demoapp/logins?from=xxx&to=yyy', function (event, payload) {
            // ok assert what you expect here:
            assert(event.Status != '404');
            assert(payload);
            done();
        });
    });

});