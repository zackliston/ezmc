/*jslint node: true */
'use strict'

// http://docs.mongodb.org/manual/reference/operator/update/#update-operators
var allowedOperators = {
  $addToSet: true,
  $bit: true,
  $currentDate: true,
  $inc: true,
  $max: true,
  $min: true,
  $mul: true,
  $pop: true,
  $pull: true,
  $pullAll: true,
  $push: true,
  $pushAll: true,
  $rename: true,
  $set: true,
  $setOnInsert: true,
  $unset: true
}

module.exports = function (key) {
  if (!(key in allowedOperators)) {
    var msg = 'only $ operators are allowed as top level setter properties'
    msg += '; see http://docs.mongodb.org/manual/reference/operator/update'

    throw new Error(msg)
  }
}
