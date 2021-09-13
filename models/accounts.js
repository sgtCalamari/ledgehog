const mongoose = require('mongoose');

const Schema = new mongoose.Schema({
  name: String,
  administrator: String,
  balance: Number,
  limit: Number
});

module.exports = {
  Schema
};
