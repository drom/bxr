'use strict';

const chai = require('chai');

const lib = require('../lib/index.js');

const expect = chai.expect;

describe('basic', () => {
  it('bxr is function', () => {
    expect(lib.bxr).to.be.a('function');
  });
});

/* eslint-env mocha */
