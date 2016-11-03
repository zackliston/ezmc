/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

describe('findOneAndReplace', () => {
  let DB;
  let mongoFindOneAndReplaceMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const findOneAndReplaceOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoFindOneAndReplaceMock = sinon.stub().returns(Promise.resolve(findOneAndReplaceOutput));
    mongoCollectionsMock = sinon.stub().returns({
      findOneAndReplace: mongoFindOneAndReplaceMock
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

    return db.findOneAndReplace(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls findOneAndReplace on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const filter = { myDelete: 'filter' };
    const replacement = { myNew: 'document' };
    const options = { someDelete: 'options' };

    return db.findOneAndReplace(collection, filter, replacement, options)
    .then(() => {
      expect(mongoFindOneAndReplaceMock).to.have.been.calledWithMatch(filter, replacement, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.findOneAndReplace(collection)
    .then((response) => {
      expect(response).to.deep.equal(findOneAndReplaceOutput);
    });
  });
});
