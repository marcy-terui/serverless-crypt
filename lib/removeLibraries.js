'use strict';

const fs = require('fs-extra');
const path = require('path');
const BbPromise = require('bluebird');

module.exports = {
  removeLibraries() {
    fs.removeSync(path.join(this.serverless.config.servicePath, 'slscrypt'));
    return BbPromise.resolve();
  },
};
