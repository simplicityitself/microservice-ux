var muonCore = require("muon-core");

var UserHandlers = require("./userApp/user-handlers");
var projections = require("./userApp/projection-helper");


var RQ = require("async-rq");
fs = require('fs');
require('sexylog');

process.env['LEVEL'] = 'trace';

var muonSystem = muonCore.generateMuon();
UserHandlers.init(muonSystem);
projections.init(muonSystem);

var workflow = RQ.sequence([
    RQ.parallel([
        projections.install_list_users_by_lastname,
        projections.install_list_users_by_id,
        projections.install_list_users_by_username
    ]),
    activateEndpoints
]);

workflow(function(value) {
    logger.info("Completed Application startup");
});

function activateEndpoints(callback, value) {
    logger.info("Activating endpoints");

    muonSystem.onCommand('/add-user', UserHandlers.addUser);
    muonSystem.onCommand('/remove-user', UserHandlers.removeUser);
    muonSystem.onCommand('/update-user', UserHandlers.updateUser);

    muonSystem.onCommand('/login-user', UserHandlers.loginUser);
    muonSystem.onCommand('/logout-user', UserHandlers.loginUser);

    muonSystem.onQuery('/find-user', UserHandlers.findUser);
    muonSystem.onQuery('/show-all-users', UserHandlers.showAllUsers);

    callback();

    //
    //muonSystem.onQuery('/logins?from&to', function() {
    //
    //});
    return function cancel(reason) {
        console.log("Asked to cancel?");
    };
}
