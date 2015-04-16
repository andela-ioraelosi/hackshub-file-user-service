'use strict';

var users = require('./../controllers/user.controller');

module.exports = function (router) {

  router.route('/signup')
    .post(users.signup);
};
