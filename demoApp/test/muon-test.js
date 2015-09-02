var muonCore = require("muon-core");
require('sexylog');
assert = require('assert');
var expect = require("chai").expect;
//require('../muon-app.js');

var muonSystem = muonCore.generateMuon();

var user1 = {"id" : "00001",
            "fname" : "J-Bo",
            "lname" : "Kermit",
            "password" : "password"};
var user2 = {"id" : "00002",
            "fname" : "Samuel",
            "lname" : "Sirname",
            "password" : "postit"};
var user3 = {"id" : "00003",
            "fname" : "Sergio",
            "lname" : "Haircut",
            "password" : "smokebreak"};
var user4 = {"id" : "00004",
            "fname" : "Nick",
            "lname" : "Lovesmuon",
            "password" : "fuuuuuuuuu"};
var user5 = {"id" : "00005",
             "lname" : "Hammond",
            "password" : "incarcerated"};


describe('Demo-user-service test', function(){

    this.timeout(10000);

    it('checks for expected projections in photon', function(done){
        // use muon to view inserted projections in eventstore
        muonSystem.resource.query('muon://eventstore/projection/blah-name', function(event, payload) {
            // ok assert what you expect here:
            assert(event.Status != '404');
            assert(payload);
            done();
        });
    });

    it('should correctly add users', function(done){
        // add 5 users here
        var thisEvent = {
                      "service-id": "muon://demoapp",
                      "local-id": 123456789,
                      "payload": [{"user": user1},
                                  {"user": user2},
                                  {"user": user3},
                                  {"user": user4},
                                  {"user": user5}],
                      "stream-name": "users",
                      "server-timestamp": Date.now()
                    };

        var i = 0;

        muonSystem.resource.command('muon://demoapp/add-user', thisEvent , function(event, payload) {
            i++;
            // ok assert what you expect here:
            assert(event.Status != '404');
            assert(payload);

            if(i == 5){
                done();
            }
        });
    });

    it('should correctly find user by id', function(done){
        var userId = "00002";
        var params = {"id" : userId};

        muonSystem.resource.query('muon://demoapp/find-user?id=' + userId, function(event, payload) {
            console.log(payload);
            assert(event.Status != '404');
            expect(payload).to.have.property("info");
            assert(payload.info.id == userId);
            done();
        }, params);
    });

    it('should correctly find user by username', function(done){
        var username = "hammondg";
        var params = {"username" : username};

        muonSystem.resource.query('muon://demoapp/find-user?username=' + username, function(event, payload) {
            console.log(payload);
            assert(event.Status != '404');
            expect(payload).to.have.property("info");
            assert(payload.info.username == username);
            done();
        }, params);
    });

    it('should correctly find user by lastname', function(done){
        var lastname = "Haircut";
        var params = {"lastname" : lastname};

        muonSystem.resource.query('muon://demoapp/find-user?lastname=' + lastname, function(event, payload) {
            console.log(payload);
            assert(event.Status != '404');
            expect(payload).to.have.property("info");
            assert(payload.info.last == lastname);
            done();
        }, params);
    });

    it('updates user', function(done){
        //update one of the 5 users here
        var newUser1 = {"id" : "00001",
                        "fname" : "J-Bo",
                        "sname" : "Kermit",
                        "password" : "newPassword"};

        var thisEvent = {
                      "service-id": "muon://demoapp",
                      "local-id": 123456789,
                      "payload": [{"user": newUser1}],
                      "stream-name": "users",
                      "server-timestamp": Date.now()
                    };


        muonSystem.resource.command('muon://demoapp/update-user', thisEvent, function(event, payload) {
            // ok assert what you expect here:
            assert(event.Status != '404');
            assert(payload);

            muonSystem.resource.query('muon://demoapp/find-user?id=' + payload.id, function(event, payload) {
                assert(event.Status != '404');
                assert(payload.password == newUser1.password);
                done();
            });
        });
    });

    it('removes user', function(done){
        // remove a user here
        var userId = {"user" : "00002"};
        muonSystem.resource.command('muon://demoapp/remove-user', userId, function(event, payload) {
            // ok assert what you expect here:
            assert(event.Status != '404');
            assert(payload);

            muonSystem.resource.query('muon://demoapp/find-user?id=' + userId, function(event, payload) {
                assert(event.Status == '404');
                done();
            });
        });
    });

    it('login a user', function(done){
        // login one of the users several times
        var userDets = {"username" : "haircuts",
                        "password" : "smokebreak" };

        var thisEvent = {
                        "service-id": "muon://demoapp",
                        "local-id": 123456789,
                        "payload": userDets,
                        "stream-name": "users",
                        "server-timestamp": Date.now()
                        };

        muonSystem.resource.command('muon://demoapp/login-user', thisEvent, function(event, payload) {
            // ok assert what you expect here:
            assert(event.Status != '404');
            expect(payload).to.have.property("message");
            expect(payload).to.have.property("status");
            done();
        });
    });

    it('should fail login with incorrect credentials', function(done){
        // login one of the users several times
        var userDets = {"username" : "kermitj",
                        "password" : "wrong" };

        var thisEvent = {
                        "service-id": "muon://demoapp",
                        "local-id": 123456789,
                        "payload": userDets,
                        "stream-name": "users",
                        "server-timestamp": Date.now()
                        };

        muonSystem.resource.command('muon://demoapp/login-user', thisEvent, function(event, payload) {
            // ok assert what you expect here:
            console.log(payload.message);
            expect(payload.message).to.contain('failed');
            done();
        });
    });

    it('show all users', function(done){
        // show all users
        muonSystem.resource.query('muon://demoapp/show-all-users', function(event, payload) {
            // ok assert what you expect here:
            assert(event.Status != '404');
            assert(payload);
            done();
        });
    });

    it('show logins between x date and y date', function(done){
        // show all logins
        var from = "";
        var to = "";
        var params = {"from" : from , "to" : to};
        muonSystem.resource.query('muon://demoapp/logins?from=' + from + '&to=' + to, function(event, payload) {
            // ok assert what you expect here:
            assert(event.Status != '404');
            assert(payload);
            done();
        }, params);
    });
});
