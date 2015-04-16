'use strict';

var request = require('supertest');

var config = require('./../../../config/config');
var app = require('./../../../config/express');

var knex = require('knex')({
  client: config.db[process.env.NODE_ENV].client,
  connection: config.db[process.env.NODE_ENV].connection,
  debug: true
});

var User = require('./../../../app/users/models/user.model')[0];
var Users = require('./../../../app/users/models/user.model')[1];

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

  xdescribe('POST /login - ', function () {


  });

});
