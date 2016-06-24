'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('geoNear', () => {
  let DB;
  let mongoGeoNearMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const geoNearOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoGeoNearMock = sinon.stub().returns(Promise.resolve(geoNearOutput));
    mongoCollectionsMock = sinon.stub().returns({
      geoNear: mongoGeoNearMock
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

    return db.geoNear(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls geoNear on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const x = 321;
    const y = 8832;
    const options = { some: 'Options' };

    return db.geoNear(collection, x, y, options)
    .then(() => {
      expect(mongoGeoNearMock).to.have.been.calledWithMatch(x, y, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.geoNear(collection)
    .then((response) => {
      expect(response).to.deep.equal(geoNearOutput);
    });
  });
});
