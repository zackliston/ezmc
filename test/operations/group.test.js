'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('group', () => {
  let DB;
  let mongoGroupMock;
  let mongoCollectionsMock;
  let mongoConnectMock;

  const groupOutput = Object.freeze({ fin: 'output' });

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoGroupMock = sinon.stub().returns(Promise.resolve(groupOutput));
    mongoCollectionsMock = sinon.stub().returns({
      group: mongoGroupMock
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

    return db.group(collection)
    .then(() => {
      expect(mongoCollectionsMock).to.have.been.calledWith(collection);
    });
  });

  it('calls group on the returned collection with the correct parameters', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';
    const keys = ['one', 'two', 'three'];
    const condition = { my: 'condition' };
    const initial = { initial: 'state' };
    const reduce = () => ('reduce');
    const finalize = () => ('finalize');
    const command = true;
    const options = { some: 'options' };

    return db.group(collection, keys, condition, initial, reduce, finalize, command, options)
    .then(() => {
      expect(mongoGroupMock).to.have.been.calledWithMatch(
        keys,
        condition,
        initial,
        reduce,
        finalize,
        command,
        options
      );
    });
  });

  it('returns the correct response', () => {
    const db = new DB('fakeConnection');
    const collection = 'myCollection';

    return db.group(collection)
    .then((response) => {
      expect(response).to.deep.equal(groupOutput);
    });
  });
});
