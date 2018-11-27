/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

describe('distinct', () => {
  let DB;
  let mongoDistinctMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const distinctOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoDistinctMock = sinon.stub().returns(Promise.resolve(distinctOutput));
    mongoCollectionsMock = sinon.stub().returns({
      distinct: mongoDistinctMock
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

    return db.distinct(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls findOne on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';
    const key = 'myKey';
    const query = { my: 'query' };
    const options = { some: 'options' };

    return db.distinct(collection, key, query, options)
    .then(() => {
      expect(mongoDistinctMock).to.have.been.calledWithMatch(key, query, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';

    return db.distinct(collection)
    .then((response) => {
      expect(response).to.deep.equal(distinctOutput);
    });
  });
});
