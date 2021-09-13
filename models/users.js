const mongoose = require('mongoose');
const isValidPassword = require('../lib/passwordUtil').isValidPassword;

const Schema = new mongoose.Schema({
  username: String,
  hash: String,
  salt: String,
  admin: Boolean
});

Schema.methods.verifyPassword = function(password) {
  return isValidPassword(password, this.hash, this.salt);
};

module.exports = {
  Schema
};
