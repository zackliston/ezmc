'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('count', () => {
  let DB;
  let mongoCountMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const countOutput = 23;

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoCountMock = sinon.stub().returns(Promise.resolve(countOutput));
    mongoCollectionsMock = sinon.stub().returns({
      count: mongoCountMock
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

    return db.count(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls count on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const query = { myCount: 'query' };
    const options = { someCount: 'options' };

    return db.count(collection, query, options)
    .then(() => {
      expect(mongoCountMock).to.have.been.calledWithMatch(query, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.count(collection)
    .then((response) => {
      expect(response).to.deep.equal(countOutput);
    });
  });
});
