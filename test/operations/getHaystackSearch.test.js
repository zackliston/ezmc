'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('geoHaystackSearch', () => {
  let DB;
  let mongoGeoHaystackSearchMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const geoHaystackSearchOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoGeoHaystackSearchMock = sinon.stub().returns(Promise.resolve(geoHaystackSearchOutput));
    mongoCollectionsMock = sinon.stub().returns({
      geoHaystackSearch: mongoGeoHaystackSearchMock
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

    return db.geoHaystackSearch(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls geoHaystackSearch on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const x = 321;
    const y = 8832;
    const options = { some: 'Options' };

    return db.geoHaystackSearch(collection, x, y, options)
    .then(() => {
      expect(mongoGeoHaystackSearchMock).to.have.been.calledWithMatch(x, y, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.geoHaystackSearch(collection)
    .then((response) => {
      expect(response).to.deep.equal(geoHaystackSearchOutput);
    });
  });
});