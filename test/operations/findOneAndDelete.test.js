'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('findOneAndDelete', () => {
  let DB;
  let mongoFindOneAndDeleteMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const findOneAndDeleteOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoFindOneAndDeleteMock = sinon.stub().returns(Promise.resolve(findOneAndDeleteOutput));
    mongoCollectionsMock = sinon.stub().returns({
      findOneAndDelete: mongoFindOneAndDeleteMock
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

    return db.findOneAndDelete(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls findOneAndDelete on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const filter = { myDelete: 'filter' };
    const options = { someDelete: 'options' };

    return db.findOneAndDelete(collection, filter, options)
    .then(() => {
      expect(mongoFindOneAndDeleteMock).to.have.been.calledWithMatch(filter, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.findOneAndDelete(collection)
    .then((response) => {
      expect(response).to.deep.equal(findOneAndDeleteOutput);
    });
  });
});
