var muonCore = require("muon-core");
require('sexylog');
assert = require('assert');
//require('../muon-app.js');

var muonSystem = muonCore.generateMuon();

var user1 = {"fname" : "J-Bo",
            "lname" : "Nickname",
            "password" : "password"};
var user2 = {"fname" : "Samuel",
            "lname" : "Sirname",
            "password" : "postit"};
var user3 = {"fname" : "Sergio",
            "lname" : "Haircut",
            "password" : "smokebreak"};
var user4 = {"fname" : "Nick",
            "lname" : "Lovesmuon",
            "password" : "fuuuuuuuuu"};
var user5 = {"fname" : "Ginger",
            "lname" : "Hammond",
            "password" : "incarcerated"};


describe('Demo-user-service test', function(){

    this.timeout(10000);

          it('injects expected projections', function(done){
               // use muon to view inserted projections in eventstore
               muonSystem.resource.query('muon://eventstore/projection/blah-name', function(event, payload) {
                    // ok assert what you expect here:
                    assert(event.Status != '404');
                    assert(payload);
                    done();
               });
          });

          it('adds user', function(done){
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

          it('updates user', function(done){
                //update one of the 5 users here
                var newUser1 = {"id" : "00001",
                                "fname" : "J-Bo",
                                "sname" : "Kermit",
                                "password" : "newPassword"};
               muonSystem.resource.command('muon://demoapp/update-user', newUser1, function(event, payload) {
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
                    });
               });
          });

          it('login a user', function(done){
                // login one of the users several times
          });

          it('finds a user', function(done){
                  // fidn one of the five users
                  var userId = "00003";
               muonSystem.resource.query('muon://demoapp/find-user?id=' + userId, function(event, payload) {
                    // ok assert what you expect here:
                    assert(event.Status != '404');
                    assert(payload);
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
