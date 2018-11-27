/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

describe('indexInformation', () => {
  let DB;
  let mongoIndexInformationMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const indexInformationOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoIndexInformationMock = sinon.stub().returns(Promise.resolve(indexInformationOutput));
    mongoCollectionsMock = sinon.stub().returns({
      indexInformation: mongoIndexInformationMock
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

    return db.indexInformation(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls indexInformation on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';
    const options = { my: 'options' };

    return db.indexInformation(collection, options)
    .then(() => {
      expect(mongoIndexInformationMock).to.have.been.calledWithMatch(options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';

    return db.indexInformation(collection)
    .then((response) => {
      expect(response).to.deep.equal(indexInformationOutput);
    });
  });
});
