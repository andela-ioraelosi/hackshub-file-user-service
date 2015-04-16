'use strict';
var config = require('./../../../config/config');
var knex = require('knex')({
  client: config.db[process.env.NODE_ENV].client,
  connection: config.db[process.env.NODE_ENV].connection,
  debug: true
});

var User = require('./../../../app/users/models/user.model');
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
        first_name: 'Uze'
      });
      done();
    });

    // Check that a new user is saved to the database.
    it('should save a new user to the database', function (done) {
      sampleUser.save().then(function (user) {
        expect(user.attributes).toEqual(jasmine.objectContaining({
          username: 'user1',
          email: 'userone@users.co',
          password: '1234',
          last_name: 'Zer',
          first_name: 'Uze'
        }));
        done();
      });
    });

    // Check that the new user cannot be saved if there's no username

    afterEach(function (done) {

      knex('users')
        .where('username', 'user1')
        .del()
        .then(function () {
          done();
        });
    });

  });

});
