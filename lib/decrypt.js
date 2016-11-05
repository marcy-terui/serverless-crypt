'use strict';

const fs = require('fs');

module.exports = {
  decrypt() {
    const secrets = JSON.parse(fs.readFileSync(this.secret_file, 'utf8'));

    const params = {
      CiphertextBlob: new Buffer(secrets[this.options.name], 'base64'),
    };

    return this.provider.request(
      'KMS',
      'decrypt',
      params,
      this.options.stage, this.options.region
    ).then((ret) => {
      this.serverless.cli.log(`Decrypted text: ${ret.Plaintext.toString('utf-8')}`);
    });
  },
};
