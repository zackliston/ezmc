/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

describe('insertMany', () => {
  let DB;
  let mongoInsertManyMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const insertManyOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoInsertManyMock = sinon.stub().returns(Promise.resolve(insertManyOutput));
    mongoCollectionsMock = sinon.stub().returns({
      insertMany: mongoInsertManyMock
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

    return db.insertMany(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls insertMany on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';
    const docs = [{ my: 'document' }];
    const options = { some: 'options' };

    return db.insertMany(collection, docs, options)
    .then(() => {
      expect(mongoInsertManyMock).to.have.been.calledWithMatch(docs, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';

    return db.insertMany(collection)
    .then((response) => {
      expect(response).to.deep.equal(insertManyOutput);
    });
  });
});
