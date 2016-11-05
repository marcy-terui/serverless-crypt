'use strict';

const expect = require('chai').expect;
const path = require('path');
const fs = require('fs-extra');
const Serverless = require('serverless/lib/Serverless');
const saveSecret = require('./../lib/saveSecret');

describe('saveSecret()', () => {
  let serverless;

  beforeEach(() => {
    serverless = new Serverless();
    saveSecret.options = {
      name: 'foo',
      region: 'us-east-1',
    };
    serverless.init();
    saveSecret.serverless = serverless;
    saveSecret.cipherText = 'bar';
    saveSecret.secret_file = path.join(__dirname, '.serverless-secret.json');
    fs.writeFileSync(saveSecret.secret_file, JSON.stringify({ buz: 'qux' }, null, 2));
  });

  afterEach(() => {
    fs.removeSync(saveSecret.secret_file);
  });

  it('should exit nothing', () => {
    saveSecret.saveSecret().then(() => {
      expect(true).to.equal(true);
    });
  });

  it('should write the secret file', () => {
    saveSecret.options.save = true;
    saveSecret.saveSecret().then(() => {
      const ret = JSON.parse(fs.readFileSync(saveSecret.secret_file, 'utf8'));
      expect(ret.foo).to.equal('bar');
      expect(ret.buz).to.equal('qux');
      expect(ret['__slscrypt-region']).to.equal('us-east-1');
    });
  });
});
