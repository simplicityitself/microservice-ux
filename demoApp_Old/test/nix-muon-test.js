var muonCore = require("muon-core");
var should = require("chai").should();
var expect = require("chai").expect;

var muonTest = muonCore.generateMuon();

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

describe('Demo-user-service query test', function(){

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


    muonTest.resource.command('muon://demoapp/add-user', thisEvent , function(event, payload) {
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
                                {"fname" : "J-Bo",
                                "lname" : "Nickname",
                                "password" : "password"}}
                            ],
                  "stream-name": "users",
                  "server-timestamp": Date.now()
                };


    muonTest.resource.command('muon://demoapp/add-user', thisEvent , function(event, payload) {
        expect(payload).to.have.property("message");
        expect(payload.message).to.equal("User created!");
        done();
    });
  });

  it('should show all users', function(done){
    var params = {};

    // show all users
    muonTest.resource.query('muon://demoapp/show-all-users', function(event, payload) {

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

});
