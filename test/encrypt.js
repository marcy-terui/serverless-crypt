'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const BbPromise = require('bluebird');
const Serverless = require('serverless/lib/Serverless');
const AwsProvider = require('serverless/lib/plugins/aws/provider/awsProvider');
const encrypt = require('./../lib/encrypt');

describe('encrypt()', () => {
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
    serverless.service.custom = {
      cryptKeyId: 'foo',
    };
    const options = {
      stage: 'dev',
      region: 'us-east-1',
      name: 'test',
      text: 'bar',
    };
    serverless.init();
    encrypt.serverless = serverless;
    encrypt.provider = new AwsProvider(serverless);
    encrypt.options = options;
  });

  it('should encrypt the secret', () => {
    const encryptStub = sinon
      .stub(encrypt.provider, 'request').returns(BbPromise.resolve({ CiphertextBlob: 'foo' }));

    const params = {
      KeyId: encrypt.serverless.service.custom.cryptKeyId,
      Plaintext: encrypt.options.text,
    };

    return encrypt.encrypt().then(() => {
      expect(encryptStub.calledOnce).to.be.equal(true);
      expect(encryptStub.calledWithExactly(
        'KMS',
        'encrypt',
        params,
        encrypt.options.stage,
        encrypt.options.region
      )).to.be.equal(true);
      encrypt.provider.request.restore();
    });
  });
});
