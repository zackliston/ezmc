/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

describe('indexes', () => {
  let DB;
  let mongoIndexesMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const indexesOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoIndexesMock = sinon.stub().returns(Promise.resolve(indexesOutput));
    mongoCollectionsMock = sinon.stub().returns({
      indexes: mongoIndexesMock
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

    return db.indexes(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls indexes on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.indexes(collection)
    .then(() => {
      expect(mongoIndexesMock).to.have.been.calledWithMatch();
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.indexes(collection)
    .then((response) => {
      expect(response).to.deep.equal(indexesOutput);
    });
  });
});
