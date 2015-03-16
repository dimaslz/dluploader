'use strict'

exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    './scenarios.js'
  ],

  capatibilities: {
    'browserName': 'chrome'
  },

  directConnect: true,

  baseUrl: 'http://localhost:8080/',

  framework: 'jasmine',

  jasmineNodeOpts: {
    defatultTimeoutInterval: 30000
  }
};
