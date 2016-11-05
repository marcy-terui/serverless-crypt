'use strict';

const BbPromise = require('bluebird'); = require('bluebird');
const fs = require('fs');
const AWS = require('aws-sdk');
const kms = new AWS.KMS({region: secret['__slscrypt-region']});
const SECRET_FILE = '.serverless-secret.json'

module.exports = {
  get(name, func) {
    const secret = JSON.parse(fs.readFileSync(SECRET_FILE, 'utf-8'));
    const promise = new Promise((resolve, reject) => {
      kms.decrypt({
        CiphertextBlob: new Buffer(secret[name], 'base64');
      }, function(err, data) {
        if (err) {
          reject(err);
        }
        resolve(data.Plaintext.toString('utf-8'));
      });
    });

    return await promise;
  }
}
