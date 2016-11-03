/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

describe('reIndex', () => {
  let DB;
  let mongoReIndexMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const reIndexOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoReIndexMock = sinon.stub().returns(Promise.resolve(reIndexOutput));
    mongoCollectionsMock = sinon.stub().returns({
      reIndex: mongoReIndexMock
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

    return db.reIndex(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls reIndex on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.reIndex(collection)
    .then(() => {
      expect(mongoReIndexMock).to.have.been.calledWithMatch();
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.reIndex(collection)
    .then((response) => {
      expect(response).to.deep.equal(reIndexOutput);
    });
  });
});
