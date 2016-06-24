'use strict'; // eslint-disable-line strict

const MongoClient = require('mongodb').MongoClient;
const debug = require('debug')('@agilemd:db-core:index');

const KEYS = {
  connection: Symbol('connection'),
  connectionString: Symbol('connectionString'),
  connectionOptions: Symbol('connectionOptions')
};

class DB {
  constructor(connectionString, _options) {
    const options = _options || {};
    debug(`init db-core with connectionString: ${connectionString} options:`, options);

    if (!connectionString) {
      throw new Error('db-core cannot be initiated without a connectionString');
    }

    this[KEYS.connectionString] = connectionString;
    this[KEYS.connectionOptions] = options;
    this.reconnect();
  }

  reconnect() {
    const connectionString = this[KEYS.connectionString];
    const options = this[KEYS.connectionOptions];
    debug(`connecting with connectionString: ${connectionString} options: `, options);

    this[KEYS.connection] = MongoClient.connect(connectionString, options);
  }

  aggregate(collection, pipeline, _options) {
    const options = _options || {};
    debug(`aggregate in collection: ${collection}`, { pipeline, options });

    return this[KEYS.connection]
    .then(db => {
      const cursor = db.collection(collection).aggregate(pipeline, options);
      if (options.returnCursor) {
        return cursor;
      }

      return cursor.toArray();
    });
  }

  count(collection, query, options) {
    debug(`count in collection: ${collection}`, { query, options });

    return this[KEYS.connection]
    .then(db => db.collection(collection).count(query, options));
  }

  createIndex(collection, fieldOrSpec, options) {
    debug(`createIndex in collection ${collection}`, { fieldOrSpec, options });

    return this[KEYS.connection]
    .then(db => db.collection(collection).createIndex(fieldOrSpec, options));
  }

  createIndexes(collection, indexSpecs) {
    debug(`createIndexes in collection ${collection}`, { indexSpecs });

    return this[KEYS.connection]
    .then(db => db.collection(collection).createIndexes(indexSpecs));
  }

  deleteMany(collection, filter, options) {
    debug(`deleteMany in collection: ${collection}`, { filter, options });

    return this[KEYS.connection]
    .then(db => db.collection(collection).deleteMany(filter, options));
  }

  deleteOne(collection, filter, options) {
    debug(`deleteOne in collection: ${collection}`, { filter, options });

    return this[KEYS.connection]
    .then(db => db.collection(collection).deleteOne(filter, options));
  }

  distinct(collection, key, query, options) {
    debug(`distinct in collection: ${collection}, key: ${key}`, { query, options });

    return this[KEYS.connection]
    .then(db => db.collection(collection).distinct(key, query, options));
  }

  drop(collection) {
    debug(`drop collection: ${collection}`);

    return this[KEYS.connection]
    .then(db => db.collection(collection).drop());
  }

  dropIndex(collection, indexName, options) {
    debug(`dropIndex in collection: ${collection}`, { indexName, options });

    return this[KEYS.connection]
    .then(db => db.collection(collection).dropIndex(indexName, options));
  }

  dropIndexes(collection) {
    debug(`dropIndexes collection: ${collection}`);

    return this[KEYS.connection]
    .then(db => db.collection(collection).dropIndexes());
  }

  find(collection, query, _options) {
    const options = _options || {};
    debug(`find in collection: ${collection}`, { query, options });

    return this[KEYS.connection]
    .then(db => {
      const cursor = db.collection(collection).find(query, options);
      if (options.returnCursor) {
        return cursor;
      }

      return cursor.toArray();
    });
  }

  findOne(collection, query, options) {
    debug(`findOne in collection: ${collection}`, { query, options });

    const modifiedOptions = Object.assign({}, options, {
      limit: 1,
      returnCursor: false
    });

    return this.find(collection, query, modifiedOptions)
    .then(results => ((results.length) ? results[0] : null));
  }

  findOneAndDelete(collection, filter, options) {
    debug(`findOneAndDelete in collection: ${collection}`, { filter, options });

    return this[KEYS.connection]
    .then(db => db.collection(collection).findOneAndDelete(filter, options));
  }

  findOneAndReplace(collection, filter, replacement, options) {
    debug(`findOneAndReplace in collection: ${collection}`, { filter, replacement, options });

    return this[KEYS.connection]
    .then(db => db.collection(collection).findOneAndReplace(filter, replacement, options));
  }

  findOneAndUpdate(collection, filter, update, options) {
    debug(`findOneAndReplace in collection: ${collection}`, { filter, update, options });

    return this[KEYS.connection]
    .then(db => db.collection(collection).findOneAndUpdate(filter, update, options));
  }
}

module.exports = DB;
