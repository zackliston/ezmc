'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('find', () => {
  let DB;
  let cursorToArrayMock;
  let cursorObject;
  let mongoFindMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const cursorToArrayOutput = ['cursor', 'toArray', 'output'];

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    cursorToArrayMock = sinon.stub().returns(Promise.resolve(cursorToArrayOutput));
    cursorObject = {
      toArray: cursorToArrayMock
    };
    mongoFindMock = sinon.stub().returns(cursorObject);
    mongoCollectionsMock = sinon.stub().returns({
      find: mongoFindMock
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

    return db.find(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls find on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const query = { find: 'query' };

    return db.find(collection, query)
    .then(() => {
      expect(mongoFindMock).to.have.been.calledWithMatch(query);
    });
  });

  it('calls toArray on returned cursor', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.find(collection)
    .then(() => {
      expect(cursorToArrayMock).to.have.been.calledOnce;
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.find(collection)
    .then((response) => {
      expect(response).to.deep.equal(cursorToArrayOutput);
    });
  });

  it('returns the cursor if options.returnCursor is true', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const options = {
      returnCursor: true
    };

    return db.find(collection, {}, options)
    .then((response) => {
      expect(response).to.deep.equal(cursorObject);
    });
  });
});
