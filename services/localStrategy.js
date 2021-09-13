const LocalStrategy = require('passport-local').Strategy;
const connection = require('./database')
const User = connection.models.User;
const isValidPassword = require('../lib/passwordUtil').isValidPassword;

const verifyCallback = (username, password, done) => {
  console.log('beginning verify user callback');
  // done([error], [validatedUser]);
  User.findOne({ username }, (err, user) => {
    if (err) return done(err);
    if (!user?.verifyPassword(password)) return done(null, false);
    console.log('user authenticated');
    return done(null, user);
  });
};

module.exports.LocalStrategy = new LocalStrategy(verifyCallback);
