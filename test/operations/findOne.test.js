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

  const expectedDoc = { a: 'document' };
  const cursorToArrayOutput = [expectedDoc, 'toArray', 'output'];

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

    return db.findOne(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls find on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const query = { find: 'query' };
    const options = { some: 'options' };
    const expectedOptions = Object.assign({}, options, {
      limit: 1
    });

    return db.findOne(collection, query, options)
    .then(() => {
      expect(mongoFindMock).to.have.been.calledWithMatch(query, expectedOptions);
    });
  });

  it('calls toArray on returned cursor', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.findOne(collection)
    .then(() => {
      expect(cursorToArrayMock).to.have.been.calledOnce;
    });
  });

  it('returns an object if there was a match', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.findOne(collection)
    .then((response) => {
      expect(response).to.deep.equal(expectedDoc);
    });
  });
});

describe('find => no match', () => {
  let DB;
  let cursorToArrayMock;
  let cursorObject;
  let mongoFindMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const cursorToArrayOutput = [];

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

  it('returns null if results array was empty', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.findOne(collection)
    .then((response) => {
      expect(response).to.equal(null);
    });
  });
});