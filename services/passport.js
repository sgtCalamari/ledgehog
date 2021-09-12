const passport = require('passport');
const passportLocal = require('passport-local');
const mongoose = require('mongoose');
const connection = require('./database');
const User = connection.models.User;
const isValidPassword = require('../lib/passwordUtil').isValidPassword;

const verifyCallback = (username, password, done) => {
  User.findOne({username: username})
    .then(user => {
      if (!user) return done(null, false);
      const isValid = isValidPassword(password, user.hash, user.salt);
      if (isValid) return done(null, user);
      done(null, false);
    })
    .catch(err => done(err));
}

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
