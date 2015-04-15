'use strict';

var config = require('./../../../config/config');
var knex = require('knex')({
  client: config.db[process.env.NODE_ENV].client,
  connection: config.db[process.env.NODE_ENV].connection,
  debug: true
});

knex.schema.hasTable('users')
  .then(function (exists) {
    if (!exists) {

    }
  });



var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: 'users',
  hasTimestamps: true
});

module.exports = User;
