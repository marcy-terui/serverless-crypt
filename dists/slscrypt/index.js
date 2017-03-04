'use strict';

const fs = require('fs');
const AWS = require('aws-sdk');

const SECRET_FILE = '.serverless-secret.json';

const aws = require('aws-sdk')

function file_data(location, cb) {
  return fs.readFile(location, 'utf8', cb)
}

function s3_data(location, cb) {
  let matches = location.match(/s3:\/\/([^\/]*)\/(.*$)/);
  let bucket = matches[1];
  let key = matches[2]
  let s3 = new aws.S3({apiVersion: '2006-03-01', signatureVersion: 'v4'});
  s3.getObject({ 'Bucket': bucket, 'Key': key }, function(err, data) {
    if(err) cb(err, data);
    else cb(err, data.Body)
  });
}

function data(location, cb) {
  if(location.startsWith('s3://')) {
    return s3_data(location, cb);
  } else if(location.startsWith('file://')) {
    return file_data(location.substring(7), cb);
  } else {
    return file_data(location, cb);
  }
}

module.exports = {
  get(name, location) {
    return new Promise((resolve, reject) => {
      data(location, function(err, data) { 
        const secret = JSON.parse(data));
        const kms = new AWS.KMS({ region: secret['__slscrypt-region'] });
        kms.decrypt({
          CiphertextBlob: new Buffer(secret[name], 'base64'),
        }, (err, data) => {
          if (err) {
            reject(err);
          }
          resolve(data.Plaintext.toString('utf-8'));
        });
      })
    });
  },
};
