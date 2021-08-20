'use strict';

const BbPromise = require('bluebird');
const validate = require('serverless/lib/plugins/aws/lib/validate');
const encrypt = require('./lib/encrypt');
const decrypt = require('./lib/decrypt');
const saveSecret = require('./lib/saveSecret');
const addLibraries = require('./lib/addLibraries');
const removeLibraries = require('./lib/removeLibraries');

const SECRET_FILE = '.serverless-secret.json';

class Crypt {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options || {};
    this.provider = this.serverless.getProvider('aws');
    this.secret_file = SECRET_FILE;

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
          name: {
            usage: 'Name of the secert',
            shortcut: 'n',
            required: true,
            type: 'string',
          },
          text: {
            usage: 'Plaintext to encrypt',
            shortcut: 't',
            type: 'string',
          },
          save: {
            usage: `Save the encrypted secret (to ${SECRET_FILE}`,
            type: 'boolean',
          },
        },
      },
      decrypt: {
        usage: 'Decrypt the encrypted secret',
        lifecycleEvents: [
          'decrypt',
        ],
        options: {
          name: {
            usage: 'Name of the secert',
            shortcut: 'n',
            required: true,
            type: 'string',
          },
        },
      },
    };

    this.hooks = {
      'before:deploy:function:packageFunction': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.addLibraries),
      'after:deploy:function:packageFunction': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.removeLibraries),
      'before:package:createDeploymentArtifacts': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.addLibraries),
      'after:package:createDeploymentArtifacts': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.removeLibraries),
      'before:invoke:local:invoke': () => BbPromise.bind(this)
        .then(this.validate)
        .then(this.addLibraries),
      'after:invoke:local:invoke': () => BbPromise.bind(this)
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
