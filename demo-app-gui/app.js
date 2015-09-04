var express = require('express');
var app = express();
var path = require('path');

app.use(express.static(__dirname + '/public'));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname , '/public/index.html'));
});

var server = app.listen(3001, function () {
  var port = server.address().port;

  console.log('demo-app-gui listening on port:' + port);
});
