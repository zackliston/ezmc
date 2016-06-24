'use strict'; // eslint-disable-line strict
/* global describe, it, beforeEach, afterEach */
/* eslint global-require: 0, no-unused-expressions: 0 */

const chai = require('chai');
const expect = chai.expect;
const mockery = require('mockery');
const sinon = require('sinon');
chai.use(require('sinon-chai'));

describe('DB class', () => {
  let DB;
  let mongoConnectMock;

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false,
      warnOnUnregistered: false,
      useCleanCache: true
    });

    mongoConnectMock = sinon.stub().returns(Promise.resolve({}));

    mockery.registerMock('mongodb', {
      MongoClient: {
        connect: mongoConnectMock
      }
    });
    DB = require('../index');
  });

  afterEach(() => {
    mockery.disable();
  });

  describe('constructor', () => {
    it('throws error if no connection string was provided', () => {
      expect(() => new DB()).to.throw(Error);
    });

    it('tries to connect using MongoClient and the provided connectionString and options', () => {
      const connectionString = 'notrealconnection';
      const options = { starting: 'options' };
      const db = new DB(connectionString, options);

      expect(db).to.be.ok; // eslint-disable-line
      expect(mongoConnectMock).to.have.been.calledWithMatch(connectionString, options);
    });
  });

  describe('reconnect', () => {
    it('calls MongoClient.connect with original connection string and options', () => {
      const connectionString = 'notrealconnection';
      const options = { some: 'options' };
      const db = new DB(connectionString, options);
      db.reconnect();

      expect(mongoConnectMock).to.have.been.calledTwice;
      expect(mongoConnectMock.getCall(1).args[0]).to.equal(connectionString);
      expect(mongoConnectMock.getCall(1).args[1]).to.deep.equal(options);
    });
  });
});
