'use strict';
var jwt = require('jsonwebtoken');
var config = require('./../../../config/config');
var secret = config.secret;

var User = require('./../models/user.model')[0];

module.exports = (function () {

  return {
    signup: function (request, response) {
      if (!(request.body.username && request.body.password && request.body.email)) {
        return response
          .status(400)
          .json({
            type: false,
            data: 'Incorrect username/password.'
          });
      }

        new User({
          username: request.body.username,
          password: request.body.password,
          email: request.body.email
        })
        .fetch()
        .then(function (user) {
          if (user) {
            return response
              .status(400)
              .json({
                type: false,
                data: 'User already exists!'
              });
            } else {
              User
                .forge({
                  username: request.body.username,
                  password: request.body.password,
                  email: request.body.email,
                  last_name: request.body.lastname,
                  first_name: request.body.firstname,
                  token: '1234'
                })
                .save()
                .then(function (user) {
                  user
                    .where({
                      username: request.body.username
                    })
                    .save({
                      'token': jwt.sign(user, secret)
                    }, {
                      method: 'update',
                      patch: true
                    })
                    .then(function (user1) {
                      response
                        .json({
                          type: true,
                          data: user1,
                          token: user1.get('token')
                        });
                    });
                });
            }

        })
        .catch(function (error) {
          response
            .json({
              type: false,
              data: 'Error occurred: ' + error
            });
        });
    }
  };

}());
