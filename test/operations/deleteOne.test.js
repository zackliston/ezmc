'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('deleteOne', () => {
  let DB;
  let mongoDeleteOneMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const deleteOneOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoDeleteOneMock = sinon.stub().returns(Promise.resolve(deleteOneOutput));
    mongoCollectionsMock = sinon.stub().returns({
      deleteOne: mongoDeleteOneMock
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

    return db.deleteOne(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls deleteOne on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const filter = { myDelete: 'filter' };
    const options = { someDelete: 'options' };

    return db.deleteOne(collection, filter, options)
    .then(() => {
      expect(mongoDeleteOneMock).to.have.been.calledWithMatch(filter, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.deleteOne(collection)
    .then((response) => {
      expect(response).to.deep.equal(deleteOneOutput);
    });
  });
});
