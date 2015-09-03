//Options for Mocha-Unfunk-Reporter
process.env['mocha-unfunk-style'] = 'html';

var should = require("chai").should();
var expect = require("chai").expect;
var supertest = require("supertest");

// Tests are designed to run on our VagrantBox
var api = supertest("http://localhost:3010");

describe('DemoApp', function(){
  describe('DemoApp API Testing - N.B. Assumes Projections are in place & NO users in the system', function(){
    //Check API is up
    it('should return a Default response', function(done){
        api.get('/api')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            expect(res.body).not.to.equal(null);
            expect(res.body).to.have.property("message");

            expect(res.body.message).not.to.equal(null);

            expect(res.body.message).to.equal("Default API response!");
            done();
        });
    });

    //Check for empty users
    it('should get an empty object back from the initial listAllUsers', function(done){
        api.get('/api/users')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            expect(res.body).not.to.equal(null);
            expect(res.body).to.have.property("message");

            expect(res.body.message).not.to.equal(null);

            expect(res.body.message).to.equal("No users found");
            done();
        });
    });

    //Check that user added incorrectly
    it('should get an error response object back from a failed user insert', function(done){
        api.post('/api/users')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send({
            firstname: "Chai_fail",
            lastname: "Mocha_fail",
            password: "testing_fail"
        })
        .expect(200)
        .end(function(err, res){
            expect(res.body).not.to.equal(null);
            expect(res.body).to.have.property("message");
            expect(res.body.message).to.equal("User not created!");
            done();
        });
    });

    //Check that user added correctly
    it('should get an success response object back from a successful user insert', function(done){
        api.post('/api/users')
        .set('Accept', 'application/x-www-form-urlencoded')
        .send({
            fname: "Chai",
            lname: "Mocha",
            password: "testing"
        })
        .expect(200)
        .end(function(err, res){
            expect(res.body).not.to.equal(null);
            expect(res.body).to.have.property("message");
            expect(res.body).to.have.property("userID");
            expect(res.body.message).to.equal("User Chai Mocha created!");
            done();
        });
    });

    //Check all users returned
    it('should get an object back from the listAllUsers', function(done){
        api.get('/api/users')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            expect(res.body).not.to.equal(null);
            expect(res.body).to.have.property("Mocha");

            expect(res.body.Mocha).not.to.equal(null);

            expect(res.body.Mocha).to.have.property("id");

            expect(res.body.Mocha).to.have.property("fullname");
            expect(res.body.Mocha.fullname).not.equal(null);

            expect(res.body.Mocha).to.have.property("username");
            expect(res.body.Mocha.username).not.equal(null);

            expect(res.body.Mocha).to.have.property("first");
            expect(res.body.Mocha.first).not.equal(null);

            expect(res.body.Mocha).to.have.property("last");
            expect(res.body.Mocha.last).not.equal(null);

            expect(res.body.Mocha).to.have.property("password");
            expect(res.body.Mocha.password).not.equal(null);
            done();
        });
    });

    //Check specific (wrong) user returned
    it('should get a message back from the UserInfo for a missing user', function(done){
        api.get('/api/users/0000')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            expect(res.body).not.to.equal(null);
            expect(res.body).to.have.property("message");

            expect(res.body.message).not.to.equal(null);

            expect(res.body.message).to.equal("No matching user found");
            done();
        });
    });
  });
});
