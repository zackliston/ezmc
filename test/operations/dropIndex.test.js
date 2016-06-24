'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('dropIndex', () => {
  let DB;
  let mongoDropIndexMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const dropIndexOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoDropIndexMock = sinon.stub().returns(Promise.resolve(dropIndexOutput));
    mongoCollectionsMock = sinon.stub().returns({
      dropIndex: mongoDropIndexMock
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

    return db.dropIndex(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls dropIndex on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const indexName = 'myIndex';
    const options = { some: 'Options' };

    return db.dropIndex(collection, indexName, options)
    .then(() => {
      expect(mongoDropIndexMock).to.have.been.calledWithMatch(indexName, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.dropIndex(collection)
    .then((response) => {
      expect(response).to.deep.equal(dropIndexOutput);
    });
  });
});
