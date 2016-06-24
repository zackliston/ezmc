'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('rename', () => {
  let DB;
  let mongoRenameMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const renameOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoRenameMock = sinon.stub().returns(Promise.resolve(renameOutput));
    mongoCollectionsMock = sinon.stub().returns({
      rename: mongoRenameMock
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

    return db.rename(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls rename on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const newName = 'myNewName';
    const options = { some: 'options' };

    return db.rename(collection, newName, options)
    .then(() => {
      expect(mongoRenameMock).to.have.been.calledWithMatch(newName, options);
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.rename(collection)
    .then((response) => {
      expect(response).to.deep.equal(renameOutput);
    });
  });
});
