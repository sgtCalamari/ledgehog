const passport = require('passport');
const LocalStrategy = require('./localStrategy').LocalStrategy;
const connection = require('./database');
const User = connection.models.User;

passport.use(LocalStrategy);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((userId, done) => {
  User.findById(userId)
    .then(user => done(null, user))
    .catch(err => done(err));
});
