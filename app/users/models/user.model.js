'use strict';
var config = require('./../../../config/config');
var knex = require('knex')({
  client: config.db[process.env.NODE_ENV].client,
  connection: config.db[process.env.NODE_ENV].connection,
  debug: true
});
var bookshelf = require('bookshelf')(knex);
var tableName = config.db[process.env.NODE_ENV].tableName;

bookshelf.knex.schema.hasTable(tableName)
  .then(function (exists) {
    if (!exists) {
      bookshelf.knex.schema.createTable(tableName, function (table) {
        table.string('id');
        table.string('username').primary();
        table.string('email').notNullable().unique();
        table.string('password').notNullable().unique();
        table.string('last_name');
        table.string('first_name');
        table.string('token').notNullable().unique();
        table.timestamps();
      })
      .then(function () {
        console.log('Schema created.');
      });
    }
  });

var User = bookshelf.Model.extend({
  tableName: tableName
});

var Users = bookshelf.Collection.extend({
  model: User
});

module.exports = [User, Users];
