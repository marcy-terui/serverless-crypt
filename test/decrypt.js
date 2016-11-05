'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const path = require('path');
const fs = require('fs');
const BbPromise = require('bluebird');
const Serverless = require('serverless/lib/Serverless');
const AwsProvider = require('serverless/lib/plugins/aws/provider/awsProvider');
const decrypt = require('./../lib/decrypt');

describe('decrypt()', () => {
  let serverless;

  beforeEach(() => {
    serverless = new Serverless();
    serverless.servicePath = true;
    serverless.service.environment = {
      vars: {},
      stages: {
        dev: {
          vars: {},
          regions: {
            'us-east-1': {
              vars: {},
            },
          },
        },
      },
    };
    serverless.service.functions = {
      hello: {
        handler: true,
      },
    };
    const options = {
      stage: 'dev',
      region: 'us-east-1',
      name: 'test',
    };
    serverless.init();
    decrypt.serverless = serverless;
    decrypt.provider = new AwsProvider(serverless);
    decrypt.options = options;
    decrypt.secret_file = path.join(path.dirname(__dirname), '.serverless-secret.json');
  });

  it('should decrypt the secret', () => {
    const secrets = JSON.parse(fs.readFileSync(decrypt.secret_file, 'utf8'));

    const params = {
      CiphertextBlob: new Buffer(secrets[decrypt.options.name], 'base64'),
    };

    const decryptStub = sinon
      .stub(decrypt.provider, 'request').returns(BbPromise.resolve({ Plaintext: 'foo' }));

    return decrypt.decrypt().then(() => {
      expect(decryptStub.calledOnce).to.be.equal(true);
      expect(decryptStub.calledWithExactly(
        'KMS',
        'decrypt',
        params,
        decrypt.options.stage,
        decrypt.options.region
      )).to.be.equal(true);
      decrypt.provider.request.restore();
    });
  });
});
