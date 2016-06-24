'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('isCapped', () => {
  let DB;
  let mongoIsCappedMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const isCappedOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoIsCappedMock = sinon.stub().returns(Promise.resolve(isCappedOutput));
    mongoCollectionsMock = sinon.stub().returns({
      isCapped: mongoIsCappedMock
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

    return db.isCapped(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls isCapped on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.isCapped(collection)
    .then(() => {
      expect(mongoIsCappedMock).to.have.been.calledWithMatch();
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.isCapped(collection)
    .then((response) => {
      expect(response).to.deep.equal(isCappedOutput);
    });
  });
});
