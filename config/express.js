'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var router = require('./../app/users/routes')();

module.exports = (function () {

  var app = express();

  app.use(bodyParser.urlencoded({
    extended: true
  }));

  app.use(bodyParser.json());

  app.use('/api/v1', router);

  return app;
}());
