/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

describe('indexExists', () => {
  let DB;
  let mongoIndexExistsMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const indexExistsOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoIndexExistsMock = sinon.stub().returns(Promise.resolve(indexExistsOutput));
    mongoCollectionsMock = sinon.stub().returns({
      indexExists: mongoIndexExistsMock
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

    return db.indexExists(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls indexExists on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';
    const indexes = ['some', 'indexes'];

    return db.indexExists(collection, indexes)
    .then(() => {
      expect(mongoIndexExistsMock).to.have.been.calledWithMatch(indexes);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';

    return db.indexExists(collection)
    .then((response) => {
      expect(response).to.deep.equal(indexExistsOutput);
    });
  });
});
