'use strict';

var request = require('supertest');
var jwt = require('jsonwebtoken');
var config = require('./../../../config/config');
var secret = config.secret;
var app = require('./../../../config/express');

var knex = require('knex')({
  client: config.db[process.env.NODE_ENV].client,
  connection: config.db[process.env.NODE_ENV].connection,
  debug: true
});

var User = require('./../../../app/users/models/user.model')[0];
var Users = require('./../../../app/users/models/user.model')[1];

var sampleUser;

describe('User API endpoints: ', function () {

  describe('POST /signup - ', function () {

    beforeEach(function (done) {
      knex('users')
        .where(1, 1)
        .del()
        .then(function () {
          done();
        });
    });

    it('should not create a new user if there is no username', function (done) {

      request(app)
        .post('/signup')
        .send({username: undefined, password: '1234', email: 'userone@users.co'})
        .expect(400)
        .end(function (err, response) {
          expect(response.body).toEqual(jasmine.objectContaining({
            data: 'Incorrect username/password.'
          }));
          done();
        });
    });

    it('should not create a new user if there is no password', function (done) {

      request(app)
        .post('/signup')
        .send({username: 'user1', password: undefined, email: 'userone@users.co'})
        .expect(400)
        .end(function (err, response) {
          expect(response.body).toEqual(jasmine.objectContaining({
            data: 'Incorrect username/password.'
          }));
          done();
        });
    });

    it('should not create a new user if there is no email', function (done) {

      request(app)
        .post('/signup')
        .send({username: 'user1', password: '1234', email: undefined})
        .expect(400)
        .end(function (err, response) {
          expect(response.body).toEqual(jasmine.objectContaining({
            data: 'Incorrect username/password.'
          }));
          done();
        });
    });

    it('should not create a new user if the username already exists', function (done) {

      User
        .forge({
          username: 'user1',
          email: 'userone@users.co',
          password: '1234',
          token: 'tolkien'
        })
        .save()
        .then(function (user) {

          request(app)
            .post('/signup')
            .send({username: 'user1', password: '1234', email: 'userone@users.co'})
            .expect(400)
            .end(function (err, response) {
              expect(response.body).toEqual(jasmine.objectContaining({
                data: 'User already exists!'
              }));
              done();
            });

        });


    });

    it('should create a new user and return the token in the response', function (done) {

      request(app)
        .post('/signup')
        .send({username: 'user1', password: '1234', email: 'userone@users.co'})
        .expect(200)
        .end(function (err, response) {
          expect(typeof response.body.token).toEqual('string');
          done();
        });
    });

    it('should create a new user and return the user data in the response', function (done) {

      request(app)
        .post('/signup')
        .send({username: 'user1', password: '1234', email: 'userone@users.co'})
        .expect(200)
        .end(function (err, response) {
          expect(response.body.data).toEqual(jasmine.objectContaining({
            username: 'user1',
            email: 'userone@users.co'
          }));
          done();
        });
    });

    afterEach(function (done) {
      knex('users')
        .where(1, 1)
        .del()
        .then(function () {
          done();
        });
    });
  });

  describe('POST /login - ', function () {

    beforeEach(function (done) {

      sampleUser = User.forge({
        username: 'user1',
        email: 'userone@users.co',
        password: '1234',
        last_name: 'Zer',
        first_name: 'Uze',
        token: 'tolkien'
      });
      done();
    });

    it('should not authenticate the user if no username was submitted', function (done) {

      sampleUser
        .save()
        .then(function (user) {
          request(app)
            .post('/login')
            .send({username: undefined, password: '1234', email: 'userone@users.co'})
            .expect(401)
            .end(function (err, response) {
              expect(response.body).toEqual(jasmine.objectContaining({
                data: 'Incorrect username/password.'
              }));
              done();
            });
        });

    });

    it('should not authenticate the user if no password was submitted', function (done) {

      sampleUser
        .save()
        .then(function (user) {
          request(app)
            .post('/login')
            .send({username: 'user1', password: undefined, email: 'userone@users.co'})
            .expect(401)
            .end(function (err, response) {
              expect(response.body).toEqual(jasmine.objectContaining({
                data: 'Incorrect username/password.'
              }));
              done();
            });
        });

    });

    it('should authenticate the user and return the token in the response', function (done) {

      sampleUser
        .save()
        .then(function (user) {
          request(app)
            .post('/login')
            .send({username: 'user1', password: '1234', email: 'userone@users.co'})
            .expect(200)
            .end(function (err, response) {
              expect(typeof response.body.token).toEqual('string');
              done();
            });
        });

    });

    it('should authenticate the user and return the user data in the response', function (done) {

      sampleUser
        .save()
        .then(function (user) {
          request(app)
            .post('/login')
            .send({username: 'user1', password: '1234', email: 'userone@users.co'})
            .expect(200)
            .end(function (err, response) {
              expect(response.body.data).toEqual(jasmine.objectContaining({
                username: 'user1',
                email: 'userone@users.co'
              }));
              done();
            });
        });

    });

    afterEach(function (done) {
      knex('users')
        .where(1, 1)
        .del()
        .then(function () {
          done();
        });
    });

  });

  describe('GET /api/v1/users - ', function () {

    beforeEach(function (done) {

      Users
        .forge([{
          username: 'user1',
          email: 'userone@users.co',
          password: '1234',
          last_name: 'Zer',
          first_name: 'Uze',
          token: 'tolkein'
        },
        {
          username: 'user1',
          email: 'usertwo@users.co',
          password: '5678',
          last_name: 'Zer',
          first_name: 'Uze',
          token: 'rice'
        }])
        .invokeThen('save')
        .then(function (users) {
          done();
        });
    });

  });

    it('should return an error message if the user is not authenticated.', function (done) {

      request(app)
        .get('/api/v1/users')
        .expect(401)
        .end(function (error, response) {
          expect(response.body).toEqual(jasmine.objectContaining({
            data: 'Unauthorized.'
          }));
          done();
        });
    });

    it('should return an array of users if user is authenticated.', function (done) {

      var itspec = this;
      itspec.userToken = null;
      User
        .forge({
          username: 'user3',
          password: '9012',
          email: 'userthree@users.co',
          last_name: 'Uzer',
          first_name: 'New',
          token: '1234'
        })
        .save()
        .then(function (user) {
          itspec.userToken = jwt.sign(user, secret);
          user
            .where({
              username: 'user3'
            })
            .save({
              'token': itspec.userToken
            }, {
              method: 'update',
              patch: true
            })
            .then(function (user3) {
              request(app)
                .get('/api/v1/users')
                .set('authorization', itspec.userToken)
                .expect(200)
                .end(function (error, response) {
                  expect(response.body.data[0]).toEqual(jasmine.objectContaining({
                    email: 'userthree@users.co'
                  }));
                  done();
                });
            });
        });
    });

    afterEach(function (done) {
      knex('users')
        .where(1, 1)
        .del()
        .then(function () {
          done();
        });
    });

});
