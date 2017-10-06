'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

const Serverless = require('serverless/lib/Serverless');
const AwsProvider = require('serverless/lib/plugins/aws/provider/awsProvider');
const BbPromise = require('bluebird');
const Crypt = require('./../index');

describe('Crypt', () => {
  let serverless;
  let crypt;

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
      function: 'hello',
      functionObj: {
        name: 'hello',
      },
    };
    serverless.init();
    serverless.setProvider('aws', new AwsProvider(serverless));
    crypt = new Crypt(serverless, options);
  });

  describe('#constructor()', () => {
    it('should have hooks', () => expect(crypt.hooks).to.be.not.empty);

    it('should set the provider variable to an instance of AwsProvider', () =>
      expect(crypt.provider).to.be.instanceof(AwsProvider));

    // it('should set an empty options object if no options are given', () => {
    //   const cryptWithEmptyOptions = new Crypt(serverless);
    //   expect(cryptWithEmptyOptions.options).to.deep.equal({});
    // });

    it('should run promise chain in order for before:deploy:function:packageFunction', () => {
      const validateStub = sinon
        .stub(crypt, 'validate').returns(BbPromise.resolve());
      const addLibrariesStub = sinon
        .stub(crypt, 'addLibraries').returns(BbPromise.resolve());

      return crypt.hooks['before:deploy:function:packageFunction']().then(() => {
        expect(validateStub.calledOnce).to.equal(true);
        expect(addLibrariesStub.calledAfter(validateStub))
          .to.equal(true);

        crypt.validate.restore();
        crypt.addLibraries.restore();
      });
    });

    it('should run promise chain in order for after:deploy:function:packageFunction', () => {
      const validateStub = sinon
        .stub(crypt, 'validate').returns(BbPromise.resolve());
      const removeLibrariesStub = sinon
        .stub(crypt, 'removeLibraries').returns(BbPromise.resolve());

      return crypt.hooks['after:deploy:function:packageFunction']().then(() => {
        expect(validateStub.calledOnce).to.equal(true);
        expect(removeLibrariesStub.calledAfter(validateStub))
          .to.equal(true);

        crypt.validate.restore();
        crypt.removeLibraries.restore();
      });
    });

    it('should run promise chain in order for before:package:createDeploymentArtifacts', () => {
      const validateStub = sinon
        .stub(crypt, 'validate').returns(BbPromise.resolve());
      const addLibrariesStub = sinon
        .stub(crypt, 'addLibraries').returns(BbPromise.resolve());

      return crypt.hooks['before:package:createDeploymentArtifacts']().then(() => {
        expect(validateStub.calledOnce).to.equal(true);
        expect(addLibrariesStub.calledAfter(validateStub))
          .to.equal(true);

        crypt.validate.restore();
        crypt.addLibraries.restore();
      });
    });

    it('should run promise chain in order for after:package:createDeploymentArtifacts', () => {
      const validateStub = sinon
        .stub(crypt, 'validate').returns(BbPromise.resolve());
      const removeLibrariesStub = sinon
        .stub(crypt, 'removeLibraries').returns(BbPromise.resolve());

      return crypt.hooks['after:package:createDeploymentArtifacts']().then(() => {
        expect(validateStub.calledOnce).to.equal(true);
        expect(removeLibrariesStub.calledAfter(validateStub))
          .to.equal(true);

        crypt.validate.restore();
        crypt.removeLibraries.restore();
      });
    });

    it('should run promise chain in order for before:invoke:local:invoke', () => {
      const validateStub = sinon
        .stub(crypt, 'validate').returns(BbPromise.resolve());
      const addLibrariesStub = sinon
        .stub(crypt, 'addLibraries').returns(BbPromise.resolve());

      return crypt.hooks['before:invoke:local:invoke']().then(() => {
        expect(validateStub.calledOnce).to.equal(true);
        expect(addLibrariesStub.calledAfter(validateStub))
          .to.equal(true);

        crypt.validate.restore();
        crypt.addLibraries.restore();
      });
    });

    it('should run promise chain in order for after:invoke:local:invoke', () => {
      const validateStub = sinon
        .stub(crypt, 'validate').returns(BbPromise.resolve());
      const removeLibrariesStub = sinon
        .stub(crypt, 'removeLibraries').returns(BbPromise.resolve());

      return crypt.hooks['after:invoke:local:invoke']().then(() => {
        expect(validateStub.calledOnce).to.equal(true);
        expect(removeLibrariesStub.calledAfter(validateStub))
          .to.equal(true);

        crypt.validate.restore();
        crypt.removeLibraries.restore();
      });
    });

    it('should run promise chain in order for encrypt:encrypt', () => {
      const validateStub = sinon
        .stub(crypt, 'validate').returns(BbPromise.resolve());
      const encryptStub = sinon
        .stub(crypt, 'encrypt').returns(BbPromise.resolve());
      const saveSecretStub = sinon
        .stub(crypt, 'saveSecret').returns(BbPromise.resolve());

      return crypt.hooks['encrypt:encrypt']().then(() => {
        expect(validateStub.calledOnce).to.equal(true);
        expect(encryptStub.calledAfter(validateStub))
          .to.equal(true);
        expect(saveSecretStub.calledAfter(encryptStub))
          .to.equal(true);

        crypt.validate.restore();
        crypt.encrypt.restore();
        crypt.saveSecret.restore();
      });
    });

    it('should run promise chain in order for decrypt:decrypt', () => {
      const validateStub = sinon
        .stub(crypt, 'validate').returns(BbPromise.resolve());
      const decryptStub = sinon
        .stub(crypt, 'decrypt').returns(BbPromise.resolve());

      return crypt.hooks['decrypt:decrypt']().then(() => {
        expect(validateStub.calledOnce).to.equal(true);
        expect(decryptStub.calledAfter(validateStub))
          .to.equal(true);

        crypt.validate.restore();
        crypt.decrypt.restore();
      });
    });
  });
});
