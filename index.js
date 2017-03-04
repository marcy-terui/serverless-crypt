'use strict';

const BbPromise = require('bluebird');
const validate = require('serverless/lib/plugins/aws/lib/validate');
const encrypt = require('./lib/encrypt');
const decrypt = require('./lib/decrypt');
const saveSecret = require('./lib/saveSecret');
const addLibraries = require('./lib/addLibraries');
const removeLibraries = require('./lib/removeLibraries');

const SECRET_LOCATION = 'file://.serverless-secret.json';

class Crypt {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('aws');
    this.secret_location = options.location || options.l || SECRET_LOCATION;

    Object.assign(
      this,
      validate,
      encrypt,
      decrypt,
      saveSecret,
      addLibraries,
      removeLibraries
    );

    this.commands = {
      encrypt: {
        usage: 'Encrypt the secret',
        lifecycleEvents: [
          'encrypt',
        ],
        options: {
          location: {
            usage: 'URL to storage, supported URI formats are file:// and s3://, no specifier is assumed to be a file path',
            shortcut: 'l',
            required: false
          },
          name: {
            usage: 'Name of the secert',
            shortcut: 'n',
            required: true,
          },
          text: {
            usage: 'Plaintext to encrypt',
            shortcut: 't',
          },
          save: {
            usage: `Save the encrypted secret (to ${this.secret_location}`,
          },
        },
      },
      decrypt: {
        usage: 'Decrypt the encrypted secret',
        lifecycleEvents: [
          'decrypt',
        ],
        options: {
          location: {
            usage: `URL to storage, supported are file:/// and s3://, defaults to ${SECRET_LOCATION}`,
            shortcut: 'l',
            required: false
          },
          name: {
            usage: 'Name of the secert',
            shortcut: 'n',
            required: true,
          },
        },
      },
    };

    this.hooks = {
      'before:deploy:function:deploy': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.addLibraries),
      'after:deploy:function:deploy': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.removeLibraries),
      'before:deploy:createDeploymentArtifacts': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.addLibraries),
      'after:deploy:deploy': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.removeLibraries),
      'encrypt:encrypt': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.encrypt)
        .then(this.saveSecret),
      'decrypt:decrypt': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.decrypt),
    };
  }
}

module.exports = Crypt;
