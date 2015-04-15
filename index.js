'use strict';

var config = require('./config/config');
var app = require('./config/express');

app.listen(config.port, function () {
  console.log('Express app listening on port: ' + config.port);
});
