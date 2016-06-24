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

### install & use
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

