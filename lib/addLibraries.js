'use strict';

const fs = require('fs-extra');
const path = require('path');
const BbPromise = require('bluebird');

module.exports = {
  addLibraries() {
    fs.copySync(
      path.join(path.dirname(__dirname), 'dists'),
      this.serverless.config.servicePath);
    if (!this.serverless.service) {
      this.serverless.service = {};
    }
    if (!this.serverless.service.package) {
      this.serverless.service.package = {};
    }
    if (!this.serverless.service.package.include) {
      this.serverless.service.package.include = [];
    }
    this.serverless.service.package.include.push('slscrypt/*');
    this.serverless.service.package.include.push('.serverless-secret.json');
    return BbPromise.resolve();
  },
};
