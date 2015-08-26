var muonCore = require("muon-core");
require('sexylog');
assert = require('assert');
//require('../muon-app.js');

var muonSystem = muonCore.generateMuon();

var user1 = {"id" : "00001",
            "fname" : "J-Bo",
            "sname" : "Nickname",
            "password" : "password"};
var user2 = {"id" : "00002",
            "fname" : "Samuel",
            "sname" : "Sirname",
            "password" : "postit"};
var user3 = {"id" : "00003",
            "fname" : "Sergio",
            "sname" : "Haircut",
            "password" : "smokebreak"};
var user4 = {"id" : "00004",
            "fname" : "Nick",
            "sname" : "Lovesmuon",
            "password" : "fuuuuuuuuu"};
var user5 = {"id" : "00005",
            "fname" : "Ginger",
            "sname" : "Hammond",
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
                muonSystem.resource.command('muon://demoapp/add-user', [user1,user2,user3,user4,user5] , function(event, payload) {
                    // ok assert what you expect here:
                    assert(event.Status != '404');
                    assert(payload);
                    done();
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
                var userId = "00002";
                muonSystem.resource.command('muon://demoapp/remove-user?id=' +userId, function(event, payload) {
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
               muonSystem.resource.query('muon://demoapp/logins?from=' + from + '&to=' + to, function(event, payload) {
                    // ok assert what you expect here:
                    assert(event.Status != '404');
                    assert(payload);
                    done();
               });
          });

});
