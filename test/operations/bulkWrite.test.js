/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

describe('bulkWrite', () => {
  let DB;
  let mongoBulkWriteMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const bulkWriteOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoBulkWriteMock = sinon.stub().returns(Promise.resolve(bulkWriteOutput));
    mongoCollectionsMock = sinon.stub().returns({
      bulkWrite: mongoBulkWriteMock
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
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';

    return db.bulkWrite(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls bulkWrite on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';
    const operations = [{ my: 'operations' }];
    const options = { some: 'options' };

    return db.bulkWrite(collection, operations, options)
    .then(() => {
      expect(mongoBulkWriteMock).to.have.been.calledWithMatch(operations, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';

    return db.bulkWrite(collection)
    .then((response) => {
      expect(response).to.deep.equal(bulkWriteOutput);
    });
  });
});
