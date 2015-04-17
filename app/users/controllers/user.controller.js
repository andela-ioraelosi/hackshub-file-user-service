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
                        data: user1.toJSON(),
                        token: user1.get('token')
                      });
                  });
              });
          }

      })
      .catch(function (error) {
        response
          .status(500)
          .json({
            type: false,
            data: 'Error occurred: ' + error
          });
      });
    },

    login: function (request, response) {
      if (!(request.body.username && request.body.password)) {
        return response
          .status(401)
          .json({
            type: false,
            data: 'Incorrect username/password.'
          });
      }

      new User({
        username: request.body.username,
        password: request.body.password
      })
      .fetch()
      .then(function (user) {
        if (user) {
          response
            .status(200)
            .json({
              type: true,
              data: user.toJSON(),
              token: user.get('token')
            });
        } else {
          response
            .status(401)
            .json({
              type: false,
              data: 'Incorrect username/password.'
            });
        }
      })
      .catch(function (error) {
        response
          .status(500)
          .json({
            type: false,
            data: 'Error occurred: ' + error
          });
      });
    },

    getAllUsers: function (request, response) {
      new User({
        token: request.token
      })
      .fetch()
      .then(function (user) {
        if (user) {
          new User()
            .fetchAll({require: true})
            .then(function (users) {
              response
                .status(200)
                .json({
                  type: true,
                  data: users.toJSON()
                });
            })
            .catch(function (error) {
              response
                .status(401)
                .json({
                  type: false,
                  data: 'Unauthorized.'
                });
            });
        }
      });
    }
  };

}());
