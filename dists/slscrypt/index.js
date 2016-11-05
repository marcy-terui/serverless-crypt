'use strict';

const fs = require('fs');
const AWS = require('aws-sdk');

const SECRET_FILE = '.serverless-secret.json';

module.exports = {
  get(name) {
    const secret = JSON.parse(fs.readFileSync(SECRET_FILE, 'utf-8'));
    const kms = new AWS.KMS({ region: secret['__slscrypt-region'] });
    return new Promise((resolve, reject) => {
      kms.decrypt({
        CiphertextBlob: new Buffer(secret[name], 'base64'),
      }, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data.Plaintext.toString('utf-8'));
      });
    });
  },
};
