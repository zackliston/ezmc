'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('createIndex', () => {
  let DB;
  let mongoCreateIndexMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const createIndexOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoCreateIndexMock = sinon.stub().returns(Promise.resolve(createIndexOutput));
    mongoCollectionsMock = sinon.stub().returns({
      createIndex: mongoCreateIndexMock
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

    return db.createIndex(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls createIndex on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const fieldOrSpec = { ourField: 'field123' };
    const options = { anOptions: 'return stuff' };

    return db.createIndex(collection, fieldOrSpec, options)
    .then(() => {
      expect(mongoCreateIndexMock).to.have.been.calledWithMatch(fieldOrSpec, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.createIndex(collection)
    .then((response) => {
      expect(response).to.deep.equal(createIndexOutput);
    });
  });
});
