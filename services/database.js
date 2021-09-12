const mongoose = require('mongoose');
const models = require('../models');
require('dotenv').config();

const conn = process.env.DB_STRING;

const connection = mongoose.createConnection(conn, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: process.env.DB_NAME
});

const User = connection.model('User', models.UserSchema);

module.exports = connection;
