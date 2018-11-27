/* eslint-disable global-require, no-unused-expressions, import/no-extraneous-dependencies */
/* global describe, it, beforeEach, afterEach */

const chai = require('chai');
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai')); // eslint-disable-line import/newline-after-import
const expect = chai.expect;

describe('mapReduce', () => {
  let DB;
  let mongoMapReduceMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const mapReduceOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoMapReduceMock = sinon.stub().returns(Promise.resolve(mapReduceOutput));
    mongoCollectionsMock = sinon.stub().returns({
      mapReduce: mongoMapReduceMock
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

    return db.mapReduce(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls mapReduce on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';
    const map = () => ('map');
    const reduce = () => ('reduce');
    const options = { my: 'options' };

    return db.mapReduce(collection, map, reduce, options)
    .then(() => {
      expect(mongoMapReduceMock).to.have.been.calledWithMatch(map, reduce, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection', 'dbName');
    const collection = 'myCollection';

    return db.mapReduce(collection)
    .then((response) => {
      expect(response).to.deep.equal(mapReduceOutput);
    });
  });
});
