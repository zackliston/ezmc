/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

describe('aggregate', () => {
  let DB;
  let cursorToArrayMock;
  let cursorObject;
  let mongoAggregateMock;
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
    mongoAggregateMock = sinon.stub().returns(cursorObject);
    mongoCollectionsMock = sinon.stub().returns({
      aggregate: mongoAggregateMock
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

    return db.aggregate(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls aggregate on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';
    const pipeline = ['pipeline', 'array'];
    const options = { aggregate: 'options' };

    return db.aggregate(collection, pipeline, options)
    .then(() => {
      expect(mongoAggregateMock).to.have.been.calledWithMatch(pipeline, options);
    });
  });

  it('calls toArray on returned cursor', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';

    return db.aggregate(collection)
    .then(() => {
      expect(cursorToArrayMock).to.have.been.calledOnce;
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';

    return db.aggregate(collection)
    .then((response) => {
      expect(response).to.deep.equal(cursorToArrayOutput);
    });
  });

  it('returns the cursor if options.returnCursor is true', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';
    const options = {
      returnCursor: true
    };

    return db.aggregate(collection, [], options)
    .then((response) => {
      expect(response).to.deep.equal(cursorObject);
    });
  });
});
