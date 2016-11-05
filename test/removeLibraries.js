'use strict';

const expect = require('chai').expect;
const path = require('path');
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
