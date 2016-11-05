'use strict';

const BbPromise = require('bluebird');
const fs = require('fs');

module.exports = {
  saveSecret() {
    if (!this.options.save) {
      return BbPromise.resolve();
    }

    let secrets = {};

    if (fs.existsSync(this.secret_file)) {
      secrets = JSON.parse(fs.readFileSync(this.secret_file, 'utf8'));
    }
    secrets['__slscrypt-region'] = this.options.region;
    secrets[this.options.name] = this.cipherText;
    fs.writeFileSync(this.secret_file, JSON.stringify(secrets, null, 2));

    this.serverless.cli.log(`Successfully saved the secret that named "${this.options.name}"`);

    return BbPromise.resolve();
  },
};
