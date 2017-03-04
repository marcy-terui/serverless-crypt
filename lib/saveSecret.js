'use strict';

const BbPromise = require('bluebird');
const fs = require('fs');

const aws = require('aws-sdk')

function file_data(location, cb) {
  if (fs.existsSync(location)) {
    fs.readFile(location, 'utf8', cb)
  } else {
    cb(null, "{}")
  }
}

function s3_data(location, cb) {
  let matches = location.match(/s3:\/\/([^\/]*)\/(.*$)/);
  let bucket = matches[1];
  let key = matches[2]
  let s3 = new aws.S3({apiVersion: '2006-03-01', signatureVersion: 'v4'});
  s3.getObject({ 'Bucket': bucket, 'Key': key }, function(err, data) {
    if(err) {
      if(err.statusCode == 404) {
        cb(null, "{}");
      } else {
        cb(err, data);
      }
    } else
    {
      cb(err, data.Body.toString());
    }
  });
}

function load(location, cb) {
  if(location.startsWith('s3://')) {
    return s3_data(location, cb);
  } else if(location.startsWith('file://')) {
    return file_data(location.substring(7), cb);
  } else {
    return file_data(location, cb);
  }
}

function file_data_save(location, data, cb) {
  fs.writeFile(location, data, cb);
}

function s3_data_save(location, data, kmsKeyId, cb) {
  let matches = location.match(/s3:\/\/([^\/]*)\/(.*$)/);
  let bucket = matches[1];
  let key = matches[2]
  let s3 = new aws.S3({apiVersion: '2006-03-01'});
  s3.putObject({ 'Bucket': bucket, 'Key': key, 'Body': data, 'SSEKMSKeyId': kmsKeyId, 'ServerSideEncryption': 'aws:kms' }, cb);
}

function save(location, data, kmsKeyId, cb) {
  if(location.startsWith('s3://')) {
    return s3_data_save(location, data, kmsKeyId, cb);
  } else if(location.startsWith('file://')) {
    return file_data_save(location.substring(7), data, cb);
  } else {
    return file_data_save(location, data, cb);
  }
}

module.exports = {
  saveSecret() {
    let _this = this;
    if (!_this.options.save) {
      return BbPromise.resolve();
    }
    load(_this.secret_location, function(err, data) {
      if(err) return BbPromise.reject(err);
      let secrets = JSON.parse(data);
      secrets['__slscrypt-region'] = _this.options.region;
      secrets[_this.options.name] = _this.cipherText;
      save(_this.secret_location, JSON.stringify(secrets, null, 2), _this.serverless.service.custom.cryptKeyId, function(err) {
        if(err) return BbPromise.reject(err);
        _this.serverless.cli.log(`Successfully saved the secret that named "${_this.options.name}" to "${_this.secret_location}"`);
        return BbPromise.resolve();
      })
    });
  },
};
