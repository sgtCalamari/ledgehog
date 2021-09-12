const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new mongoose.Schema({
  admin: Boolean
});

UserSchema.plugin(passportLocalMongoose);

module.exports = {
  UserSchema
};
