'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('updateOne', () => {
  let DB;
  let mongoUpdateOneMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const updateOneOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoUpdateOneMock = sinon.stub().returns(Promise.resolve(updateOneOutput));
    mongoCollectionsMock = sinon.stub().returns({
      updateOne: mongoUpdateOneMock
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

    return db.updateOne(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls updateOne on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const filter = { myDelete: 'filter' };
    const update = { my: 'updates' };
    const options = { someDelete: 'options' };

    return db.updateOne(collection, filter, update, options)
    .then(() => {
      expect(mongoUpdateOneMock).to.have.been.calledWithMatch(filter, update, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.updateOne(collection)
    .then((response) => {
      expect(response).to.deep.equal(updateOneOutput);
    });
  });
});
