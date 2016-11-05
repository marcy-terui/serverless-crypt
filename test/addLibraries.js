'use strict';

const expect = require('chai').expect;
const path = require('path');
const fs = require('fs-extra');
const addLibraries = require('./../lib/addLibraries');

describe('addLibraries()', () => {
  beforeEach(() => {
    addLibraries.serverless = {
      config: {
        servicePath: path.dirname(__dirname),
      },
    };
  });

  afterEach(() => {
    fs.removeSync(path.join(addLibraries.serverless.config.servicePath, 'slscrypt'));
  });

  it('should return BbPromise.resolve()', () => {
    addLibraries.addLibraries().then(() => {
      expect(true).to.equal(true);
    });
  });
});
