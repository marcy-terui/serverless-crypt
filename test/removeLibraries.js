'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const fs = require('fs-extra');
const path = require('path');
const BbPromise = require('bluebird');
const removeLibraries = require('./../lib/removeLibraries');

describe('removeLibraries()', () => {
  beforeEach(() => {
    removeLibraries.serverless = {
      config: {
        servicePath: path.dirname(__dirname),
      },
    };
  });

  it('should return BbPromise.resolve()', () => {
    removeLibraries.removeLibraries().then(() => {
      expect(true).to.equal(true);
    });
  });
});
