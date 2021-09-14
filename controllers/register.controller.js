const mongoose = require('mongoose');
const url = require('url');
const connection = require('../services/database');
const User = connection.models.User;
const hashPassword = require('../lib/passwordUtil').hashPassword;

// GET
module.exports.getRegisterPage = async (req, res) => {
  console.log('routing to user registration page');
  res.render('register.pug');
};

// POST
module.exports.postRegisterPage = async (req, res) => {
  console.log('handling requested user registration');

  const username = req.body.username;
  const saltHash = hashPassword(req.body.password);
  const hash = saltHash.hash;
  const salt = saltHash.salt;
  const admin = false;

  const newUser = new User({username, hash, salt, admin});
  var redirectUrl = '/Login?registerSuccess';

  await User.findOne({ username })
    .then(user => {
      if (user) {
        console.log('existing user found. skipping register, routing to login');
        redirectUrl = '/Login?userExists';
      }
      else {
        console.log('registering new user');
        newUser.save().then(user => console.log(user));
      }
    })
    .catch(err => console.log(err));

  res.redirect(redirectUrl);
};
