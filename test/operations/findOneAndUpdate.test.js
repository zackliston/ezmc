'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('findOneAndUpdate', () => {
  let DB;
  let mongoFindOneAndUpdateMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const findOneAndUpdateOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoFindOneAndUpdateMock = sinon.stub().returns(Promise.resolve(findOneAndUpdateOutput));
    mongoCollectionsMock = sinon.stub().returns({
      findOneAndUpdate: mongoFindOneAndUpdateMock
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

    return db.findOneAndUpdate(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls findOneAndUpdate on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const filter = { myDelete: 'filter' };
    const update = { myNew: 'updates' };
    const options = { someDelete: 'options' };

    return db.findOneAndUpdate(collection, filter, update, options)
    .then(() => {
      expect(mongoFindOneAndUpdateMock).to.have.been.calledWithMatch(filter, update, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.findOneAndUpdate(collection)
    .then((response) => {
      expect(response).to.deep.equal(findOneAndUpdateOutput);
    });
  });
});
