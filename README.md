ezmc - Easy Mongo Collection access and management
================

This module abstracts common database operations to provide a minimal API for data management. Using the base `mongodb` drive one must go through a number of steps to perform a collection operation.

```js
const MongoClient = require('mongodb').MongoClient;

const countPromise = MongoClient.connect('connectionString')
  .then(function (db) {
    const collection = db.collection('MyCollection');
    return collection.count():
  });
  
// Perform action on count
countPromise.then(function (count) {
  console.log(`MyCollection has ${count} documents`));
});
```

Mongo suggest that we only have one MongoClient per application, so we are also responsible for keeping this one client around. ezmc solves all of these problems and provides one line invocation for all collection methods.

```js
const Ezmc = require('ezmc');
const client = new Ezmc('connectionString')

client.count('MyCollection')
  .then(function (count) {
    console.log(`MyCollection has ${count} documents`));
  });
```

### Requirements

- Node.js 4.4.x - 6.2.x

### Install & use
First install ezmc

```
npm install --save ezmc
```

Secondly, to ensure there is only one instance for your entire application, we suggest that you create a file that exports 
an initialized ezmc. You then reference this file everywhere you want to use ezmc.

```js
// mongoCollections.js
const Ezmc = require('ezmc');

module.exports = new Ezmc('connectionStrings', options);
```

You can then use the same instance anywhere in your application

```js
// index.js
const mongoCollections = require('../path/to/mongoCollections');

return mongoCollections.count('MyCollection')
  .then(function (count) {
    console.log(`MyCollection has ${count} documents`);
  });
```

### Motivation
We found ourselves writing the same lines of code over and over whenever we needed access to the collections. This introduced
extra surface for errors and confusion. Secondly, it made testing a bit more difficult as we had to always stub out an extra layer or two just as setup. Finally, we did not have a consistent way of keeping one MongoClient around the entire application.

In order to keep things DRY we condensed our boilerplate code into one module. It's methods simply dereference the collection using it's single MongoClient and passes the arguments to the corrosponding Collection method.


### API
Every methods first argument is the name of the collection you're referencing. The arguments following that will be passed directly to the Mongo collection. The Mongo Collection documentation (linked under each method here) will provided details on the parameters and return values. Every method returns a promise.

**Standard Behaviour**

- `bulkWrite(collection, operations, options)` [Mongo Docs](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#bulkWrite)
- `count(collection, query, options)` [Mongo Docs](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#count)
- 

**Non-standard Behaviour**
- `aggregate(collection, pipeline, options)` [Mongo Docs](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#aggregate)
 - Will return an array of results instead of a cursor unless `options.returnCursor` is true
- `find(collection, query, options)` [Mongo Docs](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#find)
 - Will return an array of results instead of a cursor unless `options.returnCursor` is true
- `findOne(collection, query, options)` [Mongo Docs](http://mongodb.github.io/node-mongodb-native/2.0/api/Collection.html#find)
 - Convience method. Simply calls `find` with the same arguments but adds `options.limit = 1` 
