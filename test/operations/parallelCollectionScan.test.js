/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

describe('parallelCollectionScan', () => {
  let DB;
  let mongoParallelCollectionScanMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const parallelCollectionScanOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoParallelCollectionScanMock = sinon.stub().returns(Promise.resolve(parallelCollectionScanOutput));
    mongoCollectionsMock = sinon.stub().returns({
      parallelCollectionScan: mongoParallelCollectionScanMock
    });
    mongoConnectMock = sinon.stub().returns(Promise.resolve({
      collection: mongoCollectionsMock
    }));

    mockery.registerMock('mongodb', {
      MongoClient: {
        connect: mongoConnectMock
      }
    });
    DB = require('../../index');
  });

  afterEach(() => {
    mockery.disable();
  });

  it('gets the correct collection from the db object', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.parallelCollectionScan(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls parallelCollectionScan on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const options = { some: 'options' };

    return db.parallelCollectionScan(collection, options)
    .then(() => {
      expect(mongoParallelCollectionScanMock).to.have.been.calledWithMatch(options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.parallelCollectionScan(collection)
    .then((response) => {
      expect(response).to.deep.equal(parallelCollectionScanOutput);
    });
  });
});
