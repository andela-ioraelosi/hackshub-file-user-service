'use strict';

module.exports = (function () {

  return {
    db: {
      development: {
        client: 'pg',
        connection: {
          host: 'localhost',
          user: 'gnerkus',
          password: '@I651nyI#',
          database: 'fileusers',
          charset: 'utf-8'
        },
        tableName: 'users'
      },

      test: {
        client: 'pg',
        connection: {
          host: 'localhost',
          user: 'gnerkus',
          password: '@I651nyI#',
          database: 'fileusers_test',
          charset: 'utf-8'
        },
        tableName: 'users'
      },

      production: {
        client: 'pg',
        connection: {
          host: 'localhost',
          user: '',
          password: '',
          database: 'fileusers',
          charset: 'utf-8'
        },
        tableName: 'users'
      }
    },

    port: process.env.PORT || 5556
  };

}());
