const { MongoClient } = require('mongodb');
const debug = require('debug')('ezmc');

const KEYS = {
  client: Symbol('client'),
  dbName: Symbol('dbName'),
  connectionString: Symbol('connectionString'),
  connectionOptions: Symbol('connectionOption')
};

class DB {
  constructor(connectionString, dbName, _options) {
    const options = _options || {};
    Object.assign(options, { useNewUrlParser: true });

    debug(
      `init db-core with connectionString: ${connectionString} options:`,
      options
    );

    if (!connectionString) {
      throw new Error('db-core cannot be initiated without a connectionString');
    }

    this[KEYS.dbName] = dbName;
    this[KEYS.connectionString] = connectionString;
    this[KEYS.connectionOptions] = options;
  }

  async reconnect() {
    this[KEYS.client] = await MongoClient.connect(
      this[KEYS.connectionString],
      this[KEYS.connectionOptions]
    );

    return Promise.resolve(this[KEYS.client].db(this[KEYS.dbName]));
  }

  async getDatabase() {
    if (!this[KEYS.client] || !this[KEYS.client].isConnected()) {
      await this.reconnect();
    }

    return Promise.resolve(this[KEYS.client].db(this[KEYS.dbName]));
  }

  close(force) {
    return this[KEYS.client].close(force);
  }

  aggregate(collection, pipeline, _options) {
    const options = _options || {};
    debug(`aggregate in collection: ${collection}`, { pipeline, options });

    return this.getDatabase().then(db => {
      const cursor = db.collection(collection).aggregate(pipeline, options);
      if (options.returnCursor) {
        return cursor;
      }

      return cursor.toArray();
    });
  }

  bulkWrite(collection, operations, options) {
    debug(`bulkWrite in collection: ${collection}`, { operations, options });

    return this.getDatabase().then(db =>
      db.collection(collection).bulkWrite(operations, options)
    );
  }

  count(collection, query, options) {
    debug(`count in collection: ${collection}`, { query, options });

    return this.getDatabase().then(db =>
      db.collection(collection).count(query, options)
    );
  }

  createIndex(collection, fieldOrSpec, options) {
    debug(`createIndex in collection ${collection}`, { fieldOrSpec, options });

    return this.getDatabase().then(db =>
      db.collection(collection).createIndex(fieldOrSpec, options)
    );
  }

  createIndexes(collection, indexSpecs) {
    debug(`createIndexes in collection ${collection}`, { indexSpecs });

    return this.getDatabase().then(db =>
      db.collection(collection).createIndexes(indexSpecs)
    );
  }

  deleteMany(collection, filter, options) {
    debug(`deleteMany in collection: ${collection}`, { filter, options });

    return this.getDatabase().then(db =>
      db.collection(collection).deleteMany(filter, options)
    );
  }

  deleteOne(collection, filter, options) {
    debug(`deleteOne in collection: ${collection}`, { filter, options });

    return this.getDatabase().then(db =>
      db.collection(collection).deleteOne(filter, options)
    );
  }

  distinct(collection, key, query, options) {
    debug(`distinct in collection: ${collection}, key: ${key}`, {
      query,
      options
    });

    return this.getDatabase().then(db =>
      db.collection(collection).distinct(key, query, options)
    );
  }

  drop(collection) {
    debug(`drop collection: ${collection}`);

    return this.getDatabase().then(db => db.collection(collection).drop());
  }

  dropIndex(collection, indexName, options) {
    debug(`dropIndex in collection: ${collection}`, { indexName, options });

    return this.getDatabase().then(db =>
      db.collection(collection).dropIndex(indexName, options)
    );
  }

  dropIndexes(collection) {
    debug(`dropIndexes collection: ${collection}`);

    return this.getDatabase().then(db =>
      db.collection(collection).dropIndexes()
    );
  }

  find(collection, query, _options) {
    const options = _options || {};
    debug(`find in collection: ${collection}`, { query, options });

    return this.getDatabase().then(db => {
      const cursor = db.collection(collection).find(query, options);
      if (options.toArray) {
        return cursor.toArray();
      }

      return cursor;
    });
  }

  findOne(collection, query, options) {
    debug(`findOne in collection: ${collection}`, { query, options });

    const modifiedOptions = {
      ...options,
      toArray: true,
      limit: 1
    };

    return this.find(collection, query, modifiedOptions).then(results =>
      results.length ? results[0] : null
    );
  }

  findOneAndDelete(collection, filter, options) {
    debug(`findOneAndDelete in collection: ${collection}`, { filter, options });

    return this.getDatabase().then(db =>
      db.collection(collection).findOneAndDelete(filter, options)
    );
  }

  findOneAndReplace(collection, filter, replacement, options) {
    debug(`findOneAndReplace in collection: ${collection}`, {
      filter,
      replacement,
      options
    });

    return this.getDatabase().then(db =>
      db.collection(collection).findOneAndReplace(filter, replacement, options)
    );
  }

  findOneAndUpdate(collection, filter, update, options) {
    debug(`findOneAndReplace in collection: ${collection}`, {
      filter,
      update,
      options
    });

    return this.getDatabase().then(db =>
      db.collection(collection).findOneAndUpdate(filter, update, options)
    );
  }

  geoHaystackSearch(collection, x, y, options) {
    debug(`geoHaystackSearch in collection: ${collection} x: ${x}, y: ${y}`, {
      options
    });

    return this.getDatabase().then(db =>
      db.collection(collection).geoHaystackSearch(x, y, options)
    );
  }

  geoNear(collection, x, y, options) {
    debug(`geoNear in collection: ${collection} x: ${x}, y: ${y}`, { options });

    return this.getDatabase().then(db =>
      db.collection(collection).geoNear(x, y, options)
    );
  }

  group(
    collection,
    keys,
    condition,
    initial,
    reduce,
    finalize,
    command,
    options
  ) {
    debug(`group in collection: ${collection}`, {
      keys,
      condition,
      initial,
      reduce,
      finalize,
      command,
      options
    });

    return this.getDatabase().then(db =>
      db
        .collection(collection)
        .group(keys, condition, initial, reduce, finalize, command, options)
    );
  }

  indexes(collection) {
    debug(`indexes in collection ${collection}`);

    return this.getDatabase().then(db => db.collection(collection).indexes());
  }

  indexExists(collection, indexes) {
    debug(`indexExists in collection: ${collection}`, { indexes });

    return this.getDatabase().then(db =>
      db.collection(collection).indexExists(indexes)
    );
  }

  indexInformation(collection, options) {
    debug(`indexInformation in collection: ${collection}`, { options });

    return this.getDatabase().then(db =>
      db.collection(collection).indexInformation(options)
    );
  }

  insertMany(collection, docs, options) {
    debug(`insertMany in collection: ${collection}`, { docs, options });

    return this.getDatabase().then(db =>
      db.collection(collection).insertMany(docs, options)
    );
  }

  insertOne(collection, doc, options) {
    debug(`insertOne in collection: ${collection}`, { doc, options });

    return this.getDatabase().then(db =>
      db.collection(collection).insertOne(doc, options)
    );
  }

  isCapped(collection) {
    debug(`isCapped collection: ${collection}`);

    return this.getDatabase().then(db => db.collection(collection).isCapped());
  }

  listIndexes(collection, options) {
    debug(`listIndexes in collection: ${collection}`, { options });

    return this.getDatabase().then(db =>
      db.collection(collection).listIndexes(options)
    );
  }

  mapReduce(collection, map, reduce, options) {
    debug(`mapReduce in collection: ${collection}`, { map, reduce, options });

    return this.getDatabase().then(db =>
      db.collection(collection).mapReduce(map, reduce, options)
    );
  }

  options(collection) {
    debug(`options in collection: ${collection}`);

    return this.getDatabase().then(db => db.collection(collection).options());
  }

  parallelCollectionScan(collection, options) {
    debug(`parallelCollectionScan in collection: ${collection}`, { options });

    return this.getDatabase().then(db =>
      db.collection(collection).parallelCollectionScan(options)
    );
  }

  reIndex(collection) {
    debug(`reIndex in collection: ${collection}`);

    return this.getDatabase().then(db => db.collection(collection).reIndex());
  }

  rename(collection, newName, options) {
    debug(`rename in collection: ${collection}, newName: ${newName}`, {
      options
    });

    return this.getDatabase().then(db =>
      db.collection(collection).rename(newName, options)
    );
  }

  replaceOne(collection, filter, doc, options) {
    debug(`replaceOne in collection: ${collection}`, { filter, doc, options });

    return this.getDatabase().then(db =>
      db.collection(collection).replaceOne(filter, doc, options)
    );
  }

  stats(collection, options) {
    debug(`stats in collection: ${collection}`, { options });

    return this.getDatabase().then(db =>
      db.collection(collection).stats(options)
    );
  }

  updateMany(collection, filter, update, options) {
    debug(`updateMany in collection: ${collection}`, {
      filter,
      update,
      options
    });

    return this.getDatabase().then(db =>
      db.collection(collection).updateMany(filter, update, options)
    );
  }

  updateOne(collection, filter, update, options) {
    debug(`updateOne in collection: ${collection}`, {
      filter,
      update,
      options
    });

    return this.getDatabase().then(db =>
      db.collection(collection).updateOne(filter, update, options)
    );
  }
}

module.exports = DB;
