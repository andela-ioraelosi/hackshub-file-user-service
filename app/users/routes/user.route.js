'use strict';

var users = require('./../controllers/user.controller');


function ensureAuthorized (request, response, next) {
  var bearerToken;
  var bearerHeader = request.headers['authorization'];
  if (typeof bearerHeader !== 'undefined') {
    bearerToken = bearerHeader;
    request.token = bearerToken;
    next();
  } else {
    response
      .status(403)
      .json({
        type: false,
        data: 'Unauthorized.'
      });
  }
}

module.exports = function (router) {

  router.route('/signup')
    .post(users.signup);

  router.route('/login')
    .post(users.login);

  router
    .use('/api/v1/users', ensureAuthorized);

  router.route('/api/v1/users')
    .get(users.getAllUsers);
};
