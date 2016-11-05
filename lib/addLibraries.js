'use strict';

const fs = require('fs-extra');
const path = require('path');
const BbPromise = require('bluebird');

module.exports = {
  addLibraries() {
    fs.copySync(
      path.join(path.dirname(__dirname), 'dists'),
      this.serverless.config.servicePath);
    return BbPromise.resolve();
  },
};
