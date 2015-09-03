/*
  This page uses Muon-core 5.3.0 to enable running the tests in the same directory structure.
  It also uses the new shorter muon.command & muon.query format instead of the older
  muon.resource.command & muon.resource.query

  Until 5.3.0 becomes stable please ignore this as the tests will FAIL
*/

var muonCore = require("muon-core");
var should = require("chai").should();
var expect = require("chai").expect;


var amqpUrl = "amqp://muon:microservices@localhost";
var serviceName = "testing";
var muonTest = muonCore.generateMuon(serviceName, amqpUrl);

//var muonTest = muonCore.generateMuon();

var user1 = {"id" : "0002",
            "fname" : "J-Bo",
            "lname" : "Nickname",
            "password" : "password"};
var user2 = {"id" : "0003",
            "fname" : "Samuel",
            "lname" : "Sirname",
            "password" : "postit"};
var user3 = {"id" : "0004",
            "fname" : "Sergio",
            "lname" : "Haircut",
            "password" : "smokebreak"};
var user4 = {"id" : "0005",
            "fname" : "Nick",
            "lname" : "Lovesmuon",
            "password" : "fuuuuuuuuu"};
var user5 = {"id" : "0006",
            "fname" : "Ginger",
            "lname" : "Hammond",
            "password" : "incarcerated"};

describe('Demo-user-service - Add User', function(){

  this.timeout(10000);

  it('should correctly FAIL to add a user', function(done){
    //Add 1 User for test
    var thisEvent = {
                  "service-id": "muon://demoapp",
                  "local-id": 123456789,
                  "payload": [ {"user" :
                                {"firstname" : "Wrong",
                                "lastname" : "Name",
                                "password" : "secret"}}
                            ],
                  "stream-name": "users",
                  "server-timestamp": Date.now()
                };


    muonTest.command('muon://demoapp/add-user', thisEvent , function(event, payload) {
        expect(payload).to.have.property("message");
        expect(payload.message).to.equal("User not created!");
        done();
    });
  });

  it('should correctly add a user', function(done){
    //Add 1 User for test
    var thisEvent = {
                  "service-id": "muon://demoapp",
                  "local-id": 123456789,
                  "payload": [ {"user" :
                                {"fname" : "Zippy",
                                "lname" : "George",
                                "password" : "rainbow"}}
                            ],
                  "stream-name": "users",
                  "server-timestamp": Date.now()
                };


    muonTest.command('muon://demoapp/add-user', thisEvent , function(event, payload) {
        expect(payload).to.have.property("message");
        expect(payload).to.have.property("userID");
        expect(payload.message).to.equal("User Zippy George created!");
        done();
    });
  });
});

describe('Demo-user-service - User manipulation', function(){
  this.timeout(10000);

  before(function() {
    //Add 5 Users for test
    var thisEvent = {
                  "service-id": "muon://demoapp",
                  "local-id": 234567890,
                   "payload": [
                                {"user": user1},
                                {"user": user2},
                                {"user": user3},
                                {"user": user4},
                                {"user": user5},
                              ],
                  "stream-name": "users",
                  "server-timestamp": Date.now()
                };


    muonTest.command('muon://demoapp/add-user', thisEvent , function(event, payload) {

    });
  });

  it('should update a user', function(done){
    //Update 1 User for test
    var thisEvent = {
                  "service-id": "muon://demoapp",
                  "local-id": 123456789,
                  "payload": {"user" :
                                {"id" : "0002",
                                "fname" : "J-Bo",
                                "lname" : "Nickname",
                                "password" : "new_password"}
                            },
                  "stream-name": "users",
                  "server-timestamp": Date.now()
                };


    muonTest.command('muon://demoapp/update-user', thisEvent , function(event, payload) {
        expect(payload).to.have.property("message");
        expect(payload).to.have.property("userID");
        expect(payload.message).to.equal("User J-Bo Nickname updated!");
        done();
    });
  });

  it('should remove a user', function(done){

    //deactivate 1 User for test
    var thisEvent = {
                  "service-id": "muon://demoapp",
                  "local-id": 123456789,
                  "payload": {"user" :
                                {"id" : "0005",
                                "fname" : "Nick",
                                "lname" : "Lovesmuon",
                                "password" : "fuuuuuuuuu",
                                "active": false,
                              }
                            },
                  "stream-name": "users",
                  "server-timestamp": Date.now()
                };


    muonTest.command('muon://demoapp/remove-user', thisEvent , function(event, payload) {
        expect(payload).to.have.property("message");
        expect(payload).to.have.property("active");
        expect(payload.message).to.equal("User Nick Lovesmuon updated!");
        done();
    });
  });

  it('should fail gracefully when the wrong parameters are used to find a user', function(done){
    var params = {"wrong" : "thing"};

    // show user by username
    muonTest.query('muon://demoapp/find-user', function(event, payload) {

      expect(payload).to.have.property("message");
      expect(payload.message).to.equal("Sorry, wrong parameters passed");
      done();

    }, params);
  });

    it('should return an empty object when there is no match in find a user', function(done){
    var params = {"id" : "00000"};

    // show user by username
    muonTest.query('muon://demoapp/find-user', function(event, payload) {

      expect(payload).to.have.property("message");
      expect(payload.message).to.equal("Found user");
      expect(payload).not.to.have.property("info");
      done();

    }, params);
  });

  it('should find a user by username', function(done){
    var params = {"username" : "hammondg"};

    // show user by username
    muonTest.query('muon://demoapp/find-user', function(event, payload) {

      expect(payload).to.have.property("message");
      expect(payload).to.have.property("info");
      expect(payload.message).to.equal("Found user");

      expect(payload.info).to.have.property("id");

      expect(payload.info).to.have.property("fullname");
      expect(payload.info.fullname).not.equal(null);

      expect(payload.info).to.have.property("username");
      expect(payload.info.username).not.equal(null);

      expect(payload.info).to.have.property("first");
      expect(payload.info.first).not.equal(null);

      expect(payload.info).to.have.property("last");
      expect(payload.info.last).not.equal(null);

      expect(payload.info).to.have.property("password");
      expect(payload.info.password).not.equal(null);

      done();

    }, params);
  });

  it('should find a user by last name', function(done){
    var params = {"lastname" : "Haircut"};

    // show user by last name
    muonTest.query('muon://demoapp/find-user', function(event, payload) {

      expect(payload).to.have.property("message");
      expect(payload).to.have.property("info");
      expect(payload.message).to.equal("Found user");

      expect(payload.info).to.have.property("id");

      expect(payload.info).to.have.property("fullname");
      expect(payload.info.fullname).not.equal(null);

      expect(payload.info).to.have.property("username");
      expect(payload.info.username).not.equal(null);

      expect(payload.info).to.have.property("first");
      expect(payload.info.first).not.equal(null);

      expect(payload.info).to.have.property("last");
      expect(payload.info.last).not.equal(null);

      expect(payload.info).to.have.property("password");
      expect(payload.info.password).not.equal(null);

      done();

    }, params);
  });


  it('should find a user by ID', function(done){
    var params = {"id" : "0003"};

    // show user by ID
    muonTest.query('muon://demoapp/find-user', function(event, payload) {

      expect(payload).to.have.property("message");
      expect(payload).to.have.property("info");
      expect(payload.message).to.equal("Found user");

      expect(payload.info).to.have.property("id");

      expect(payload.info).to.have.property("fullname");
      expect(payload.info.fullname).not.equal(null);

      expect(payload.info).to.have.property("username");
      expect(payload.info.username).not.equal(null);

      expect(payload.info).to.have.property("first");
      expect(payload.info.first).not.equal(null);

      expect(payload.info).to.have.property("last");
      expect(payload.info.last).not.equal(null);

      expect(payload.info).to.have.property("password");
      expect(payload.info.password).not.equal(null);

      done();

    }, params);
  });

/*
  it('should show all users', function(done){
    var params = {};

    // show all users
    muonTest.query('muon://demoapp/show-all-users', function(event, payload) {

      expect(payload).to.have.property("message");
      expect(payload).to.have.property("info");
      expect(payload.message).to.equal("showAllUsers response");

      expect(payload.info).to.have.property("Mocha");

      expect(payload.info.Mocha).not.to.equal(null);

      expect(payload.info.Mocha).to.have.property("id");

      expect(payload.info.Mocha).to.have.property("fullname");
      expect(payload.info.Mocha.fullname).not.equal(null);

      expect(payload.info.Mocha).to.have.property("username");
      expect(payload.info.Mocha.username).not.equal(null);

      expect(payload.info.Mocha).to.have.property("first");
      expect(payload.info.Mocha.first).not.equal(null);

      expect(payload.info.Mocha).to.have.property("last");
      expect(payload.info.Mocha.last).not.equal(null);

      expect(payload.info.Mocha).to.have.property("password");
      expect(payload.info.Mocha.password).not.equal(null);

      done();

    }, params);
  });
*/  
  
});


describe('Demo-user-service - Access control', function(){
  it('should login a user', function(done){

     var thisEvent = {
                  "service-id": "muon://demoapp",
                  "local-id": 123456789,
                  "payload": {
                              "username" : "hammondg",
                              "password" : "incarcerated"
                            },
                  "stream-name": "access",
                  "server-timestamp": Date.now()
                };

    muonTest.command('muon://demoapp/login-user', thisEvent , function(event, payload) {
        expect(payload).to.have.property("message");
        expect(payload).to.have.property("status");
        expect(payload.message).to.equal("User hammondg succcessfully logged in");
        done();
    });
  });

  it('should reject a bad password from a known user', function(done){

     var thisEvent = {
                  "service-id": "muon://demoapp",
                  "local-id": 123456789,
                  "payload": {
                              "username" : "hammondg",
                              "password" : "wrong"
                            },
                  "stream-name": "access",
                  "server-timestamp": Date.now()
                };

    muonTest.command('muon://demoapp/login-user', thisEvent , function(event, payload) {
        expect(payload).to.have.property("message");
        expect(payload).to.have.property("status");
        expect(payload.message).to.equal("User hammondg failed to login");
        done();
    });
  });

  it('should reject and notify login attempts from inactive or removed users', function(done){

     var thisEvent = {
                  "service-id": "muon://demoapp",
                  "local-id": 123456789,
                  "payload": {
                              "username" : "lovesmun",
                              "password" : "fuuuuuuuuu"
                            },
                  "stream-name": "access",
                  "server-timestamp": Date.now()
                };

    muonTest.command('muon://demoapp/login-user', thisEvent , function(event, payload) {
        expect(payload).to.have.property("message");
        expect(payload.message).to.equal("User lovesmun currently inactive. Login failed.");
        done();
    });
  });

  it('should reject login attempts from unknown users', function(done){

     var thisEvent = {
                  "service-id": "muon://demoapp",
                  "local-id": 123456789,
                  "payload": {
                              "username" : "blah-blah",
                              "password" : "blip-blip"
                            },
                  "stream-name": "access",
                  "server-timestamp": Date.now()
                };

    muonTest.command('muon://demoapp/login-user', thisEvent , function(event, payload) {
        expect(payload).to.have.property("message");
        expect(payload.message).to.equal("Incorrect User details. Login failed.");
        done();
    });
  });

  it('should show login activity between two dates');

});
