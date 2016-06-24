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

## install & use
