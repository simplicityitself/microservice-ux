var muonCore = require("muon-core");
require('sexylog');
assert = require('assert');

var muonSystem = muonCore.generateMuon();


describe('Demo-user-service test', function(){

          it('injects expected projections', function(done){
               // use muon to view inserted projections in eventstore
               moun.resource.query('muon://eventsotre/projection/blah-name', function(event, payload) {
                    // ok assert what you expect here:
                    assert(event.Status != '404');
                    assert(payload);
                    done();

               });
          });

          it('adds user', function(done){
                // add 5 users here
          });

          it('updates user', function(done){
                //update one of the 5 users here
          });

          it('removes user', function(done){
                // remove a user here
          });

          it('login a user', function(done){
                // login one of the users several times
          });

          it('finds a user', function(done){
                  // fidn one of the five users
          });

          it('show all users', function(done){
                  // show all users
          });

          it('show logins between x date and y date', function(done){
                  // show all logins
          });

}