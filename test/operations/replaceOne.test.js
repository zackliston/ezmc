'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('replaceOne', () => {
  let DB;
  let mongoReplaceOneMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const replaceOneOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoReplaceOneMock = sinon.stub().returns(Promise.resolve(replaceOneOutput));
    mongoCollectionsMock = sinon.stub().returns({
      replaceOne: mongoReplaceOneMock
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

    return db.replaceOne(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls replaceOne on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const filter = { test: 'filter' };
    const doc = { newDoc: 'info' };
    const options = { some: 'options' };

    return db.replaceOne(collection, filter, doc, options)
    .then(() => {
      expect(mongoReplaceOneMock).to.have.been.calledWithMatch(filter, doc, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.replaceOne(collection)
    .then((response) => {
      expect(response).to.deep.equal(replaceOneOutput);
    });
  });
});
