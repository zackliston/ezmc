/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

describe('updateMany', () => {
  let DB;
  let mongoUpdateManyMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const updateManyOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoUpdateManyMock = sinon.stub().returns(Promise.resolve(updateManyOutput));
    mongoCollectionsMock = sinon.stub().returns({
      updateMany: mongoUpdateManyMock
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

    return db.updateMany(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls updateMany on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const filter = { myDelete: 'filter' };
    const update = { my: 'updates' };
    const options = { someDelete: 'options' };

    return db.updateMany(collection, filter, update, options)
    .then(() => {
      expect(mongoUpdateManyMock).to.have.been.calledWithMatch(filter, update, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.updateMany(collection)
    .then((response) => {
      expect(response).to.deep.equal(updateManyOutput);
    });
  });
});
