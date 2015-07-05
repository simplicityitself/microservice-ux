var assert = require('assert');
var sinon = require('sinon');

var nodemailer = require('nodemailer');

/*
describe('mail_service: ', function () {
    var mailerSender = sinon.stub();
    var emailResource;
    var swaggerErrorHandler = sinon.stub();

    before(function (done) {
        nodemailer.createTransport = function () {
            return {
                sendMail: mailerSender
            };
        };
        emailResource = mail_resources.email({
            "sender": {
                "name": "test sender",
                "address": "test@source.mail"
            }});
        swagger.setErrorHandler(swaggerErrorHandler);
        done();
    });

    beforeEach(function () {
        mailerSender.reset();
        swaggerErrorHandler.reset();
    });

    function requestPrototype() {
        return {
            is: function () {
                return true;
            },
            body: {
                "address": "test@mail.com",
                "subject": "test subject",
                "body": "test body"
            }}
    }

    it('should send mail on correct input', function (done) {
        mailerSender.yields(null, {response: "sender response"});
        var req = requestPrototype();
        var res = {send: sinon.spy()};
        emailResource.action(req, res);

        assert(mailerSender.calledOnce);
        assert(res.send.calledOnce);

        assert(res.send.calledWith(200, {success: true, code: 200, message: "sender response"}));
        done();
    });

    it('should throw bad request swagger error on wrong address', function (done) {
        var req = requestPrototype();
        req.body.address = "wrongAddress";
        var res = {send: sinon.spy()};
        assert.throws(function () {
            emailResource.action(req, res);
        }, function (err) {
            assert.deepEqual(err, {code: 400, message: "invalid address"});
            return true;
        });
        assert(mailerSender.notCalled);
        done();
    });

    it('should throw bad request swagger error if body is not parsed', function (done) {
        var req = requestPrototype();
        req.body = {};
        req.is = function () {
            return false;
        };
        var res = {send: sinon.spy()};
        assert.throws(function () {
            emailResource.action(req, res);
        }, function (err) {
            assert.deepEqual(err, {code: 400, message: "invalid content-type"});
            return true;
        });
        assert(mailerSender.notCalled);
        done();
    });

    it('should throw bad request swagger error on empty subject', function (done) {
        var req = requestPrototype();
        delete req.body.subject;
        var res = {send: sinon.spy()};
        assert.throws(function () {
            emailResource.action(req, res);
        }, function (err) {
            assert.deepEqual(err, {code: 400, message: "invalid subject"});
            return true;
        });
        assert(mailerSender.notCalled);
        done();
    });

    it('should throw bad request swagger error on empty body', function (done) {
        var req = requestPrototype();
        delete req.body.body;
        var res = {send: sinon.spy()};
        assert.throws(function () {
            emailResource.action(req, res);
        }, function (err) {
            assert.deepEqual(err, {code: 400, message: "invalid body"});
            return true;
        });
        assert(mailerSender.notCalled);
        done();
    });

    it('swagger error handler is called if mailer causes error', function (done) {
        var req = requestPrototype();
        const sampleErrorMessage = "error message";
        mailerSender.yields({message: sampleErrorMessage}, null);

        var res = {send: sinon.spy()};
        emailResource.action(req, res);

        assert(swaggerErrorHandler.calledWith(req, res, {code: 500, message: sampleErrorMessage}));

        assert(mailerSender.calledOnce);
        done();
    });

});
    */