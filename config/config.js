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
        }
      },

      test: {
        client: 'pg',
        connection: {
          host: 'localhost',
          user: 'gnerkus',
          password: '',
          database: 'fileusers_test',
          charset: 'utf-8'
        }
      },

      production: {
        client: 'pg',
        connection: {
          host: 'localhost',
          user: '',
          password: '',
          database: 'fileusers',
          charset: 'utf-8'
        }
      }
    },

    port: process.env.PORT || 5556
  };

}());
