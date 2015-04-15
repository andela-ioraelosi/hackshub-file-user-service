'use strict';

var express = require('express');
var userRoutes = require('./user.route');

module.exports = function () {

  var router = express.Router();

  userRoutes(router);

  return router;
};
