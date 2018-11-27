/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

describe('insertOne', () => {
  let DB;
  let mongoInsertOneMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const insertOneOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoInsertOneMock = sinon.stub().returns(Promise.resolve(insertOneOutput));
    mongoCollectionsMock = sinon.stub().returns({
      insertOne: mongoInsertOneMock
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

    return db.insertOne(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls insertOne on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';
    const doc = { my: 'document' };
    const options = { some: 'options' };

    return db.insertOne(collection, doc, options)
    .then(() => {
      expect(mongoInsertOneMock).to.have.been.calledWithMatch(doc, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';

    return db.insertOne(collection)
    .then((response) => {
      expect(response).to.deep.equal(insertOneOutput);
    });
  });
});
