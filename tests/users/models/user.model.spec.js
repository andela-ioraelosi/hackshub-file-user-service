'use strict';
var config = require('./../../../config/config');
var knex = require('knex')({
  client: config.db[process.env.NODE_ENV].client,
  connection: config.db[process.env.NODE_ENV].connection,
  debug: true
});

var User = require('./../../../app/users/models/user.model')[0];
var Users = require('./../../../app/users/models/user.model')[1];
var sampleUser = null;
var sampleUsers = null;

describe('User Model: ', function () {

  describe('Create users - ', function () {

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

    // Check that a new user is saved to the database.
    it('should save a new user to the database', function (done) {
      sampleUser
        .save()
        .then(function (user) {
          expect(user.toJSON()).toEqual(jasmine.objectContaining({
            username: 'user1',
            email: 'userone@users.co',
            password: '1234',
            last_name: 'Zer',
            first_name: 'Uze',
            token: 'tolkien'
          }));
          done();
        });
    });

    // Check that the new user cannot be saved if there's no username
    it('should not save a user without a username', function (done) {
      sampleUser.set({username: null});
      sampleUser
        .save()
        .then(function (user) {
        })
        .catch(function (error) {
          expect(error).toBeDefined();
          done();
        });
    });

    // Check that the new user cannot be saved if the username already exists
    it('should not save if username not unique', function (done) {
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

        })
        .catch(function (error) {
          expect(error).toBeDefined();
          done();
        });
    });

    // Check that the new user cannot be saved without setting the email property
    it('should not save a user without an email', function (done) {
      sampleUser.set({email: null});
      sampleUser
        .save()
        .then(function (user) {
        })
        .catch(function (error) {
          expect(error).toBeDefined();
          done();
        });
    });

    // Check that the new user cannot be saved if the email already exists
    it('should not save if email not unique', function (done) {
      Users
        .forge([{
          username: 'user1',
          email: 'userone@users.co',
          password: '1234',
          last_name: 'Zer',
          first_name: 'Uze',
          token: 'tolkien'
        },
        {
          username: 'user2',
          email: 'userone@users.co',
          password: '5678',
          last_name: 'Zer',
          first_name: 'Uze',
          token: 'rice'
        }])
        .invokeThen('save')
        .then(function (users) {

        })
        .catch(function (error) {
          expect(error).toBeDefined();
          done();
        });
    });

    // Check that the new user cannot be saved without setting the password property
    it('should not save a user without an password', function (done) {
      sampleUser.set({password: null});
      sampleUser
        .save()
        .then(function (user) {
        })
        .catch(function (error) {
          expect(error).toBeDefined();
          done();
        });
    });

    // Check that the new user cannot be saved if the password already exists
    it('should not save if password not unique', function (done) {
      Users
        .forge([{
          username: 'user1',
          email: 'userone@users.co',
          password: '1234',
          last_name: 'Zer',
          first_name: 'Uze',
          token: 'tolkien'
        },
        {
          username: 'user2',
          email: 'usertwo@users.co',
          password: '1234',
          last_name: 'Zer',
          first_name: 'Uze',
          token: 'rice'
        }])
        .invokeThen('save')
        .then(function (users) {

        })
        .catch(function (error) {
          expect(error).toBeDefined();
          done();
        });
    });

    // Check that the new user cannot be saved if there's no token
    it('should not save a user without a token', function (done) {
      sampleUser.set({token: null});
      sampleUser
        .save()
        .then(function (user) {
        })
        .catch(function (error) {
          expect(error).toBeDefined();
          done();
        });
    });

    // Check that the new user cannot be saved if the token already exists
    it('should not save if token is not unique', function (done) {
      Users
        .forge([{
          username: 'user1',
          email: 'userone@users.co',
          password: '1234',
          last_name: 'Zer',
          first_name: 'Uze',
          token: 'tolkien'
        },
        {
          username: 'user2',
          email: 'usertwo@users.co',
          password: '5678',
          last_name: 'Zer',
          first_name: 'Uze',
          token: 'tolkien'
        }])
        .invokeThen('save')
        .then(function (users) {

        })
        .catch(function (error) {
          expect(error).toBeDefined();
          done();
        });
    });

    afterEach(function (done) {

      knex('users')
        .where('username', 'user1')
        .del()
        .then(function () {
          done();
        });
    });

  });

  describe('Update users - ', function () {

    beforeEach(function (done) {
      User
        .forge({
          username: 'user3',
          email: 'userthree@users.co',
          password: '369',
          last_name: 'Zer',
          first_name: 'Uze',
          token: 'tolkien'
        })
        .save()
        .then(function (user) {
          done();
        });
    });

    it('should update the username', function (done) {
      User
        .where({
          username: 'user3'
        })
        .save({
          username: 'user4'
        },
        {
          method: 'update',
          patch: true
        })
        .then(function (user) {
          expect(user.toJSON()).toEqual(jasmine.objectContaining({
            username: 'user4'
          }));
          done();
        });

    });

    afterEach(function (done) {
      knex('users')
        .where('password', '369')
        .del()
        .then(function () {
          done();
        });
    });

  });

  describe('Delete users - ', function () {

    beforeEach(function (done) {
      User
        .forge({
          username: 'user3',
          email: 'userthree@users.co',
          password: '369',
          last_name: 'Zer',
          first_name: 'Uze',
          token: 'tolkien'
        })
        .save()
        .then(function (user) {
          done();
        });
    });

    it('should delete the user', function (done) {
      User
        .where({
          username: 'user3'
        })
        .destroy()
        .then(function (user) {
          expect(user.toJSON()).toEqual({});
          done();
        });
    });

    afterEach(function (done) {
      knex('users')
        .where('password', '369')
        .del()
        .then(function () {
          done();
        });
    });

  });

});
