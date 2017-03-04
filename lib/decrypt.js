'use strict';

const fs = require('fs');
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
  decrypt() {
    let _this = this;
    return data(_this.secret_location, function(err, data) {
      if(err) _this.serverless.cli.log(err);
      else {
        const secrets = JSON.parse(data);

        const params = {
          CiphertextBlob: new Buffer(secrets[_this.options.name], 'base64'),
        };

        return _this.provider.request(
          'KMS',
          'decrypt',
          params,
          _this.options.stage, _this.options.region
        ).then((ret) => {
          _this.serverless.cli.log(`Decrypted text: ${ret.Plaintext.toString('utf-8')}`);
        });
      }
    });
  },
};
