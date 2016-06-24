'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('createIndexes', () => {
  let DB;
  let mongoCreateIndexesMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const createIndexesOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoCreateIndexesMock = sinon.stub().returns(Promise.resolve(createIndexesOutput));
    mongoCollectionsMock = sinon.stub().returns({
      createIndexes: mongoCreateIndexesMock
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

    return db.createIndexes(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls createIndexes on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const indexSpecs = [{ ourField: 'field123' }];

    return db.createIndexes(collection, indexSpecs)
    .then(() => {
      expect(mongoCreateIndexesMock).to.have.been.calledWithMatch(indexSpecs);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.createIndexes(collection)
    .then((response) => {
      expect(response).to.deep.equal(createIndexesOutput);
    });
  });
});
