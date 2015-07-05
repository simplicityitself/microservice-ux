var nodemailer = require('nodemailer');
var validator = require('validator');

exports.email = function (config, payload) {
    var transporter = nodemailer.createTransport(config);

    // validate payload

    return {
        send: function (success, failure) {
            transporter.sendMail(payload, function (error, info) {

                console.log('Sending');
                if(error) {
                    console.log("We have an error");
                    console.dir(error);
                    console.dir(info);
                    if(typeof(failure) == 'function') {
                        failure(error, info);
                    }
                } else {
                    if(typeof(success) == 'function') {
                        success(info);
                    }
                }
            });
        }
    };
};