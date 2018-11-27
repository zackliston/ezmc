/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

describe('deleteMany', () => {
  let DB;
  let mongoDeleteManyMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const deleteManyOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoDeleteManyMock = sinon.stub().returns(Promise.resolve(deleteManyOutput));
    mongoCollectionsMock = sinon.stub().returns({
      deleteMany: mongoDeleteManyMock
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

    return db.deleteMany(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls deleteMany on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';
    const filter = { myDelete: 'filter' };
    const options = { someDelete: 'options' };

    return db.deleteMany(collection, filter, options)
    .then(() => {
      expect(mongoDeleteManyMock).to.have.been.calledWithMatch(filter, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';

    return db.deleteMany(collection)
    .then((response) => {
      expect(response).to.deep.equal(deleteManyOutput);
    });
  });
});
