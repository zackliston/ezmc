'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

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
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.indexExists(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls indexExists on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const indexes = ['some', 'indexes'];

    return db.indexExists(collection, indexes)
    .then(() => {
      expect(mongoIndexExistsMock).to.have.been.calledWithMatch(indexes);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.indexExists(collection)
    .then((response) => {
      expect(response).to.deep.equal(indexExistsOutput);
    });
  });
});
