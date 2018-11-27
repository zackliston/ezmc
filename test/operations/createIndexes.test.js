/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

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
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';

    return db.createIndexes(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls createIndexes on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';
    const indexSpecs = [{ ourField: 'field123' }];

    return db.createIndexes(collection, indexSpecs)
    .then(() => {
      expect(mongoCreateIndexesMock).to.have.been.calledWithMatch(indexSpecs);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';

    return db.createIndexes(collection)
    .then((response) => {
      expect(response).to.deep.equal(createIndexesOutput);
    });
  });
});
