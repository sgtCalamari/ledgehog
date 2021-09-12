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
  const salt = saltHash.salt;
  const hash = saltHash.hash;

  const newUser = new User({
    username: username,
    hash: hash,
    salt: salt,
    admin: false
  });

  newUser.save().then(user => console.log(user));

  res.redirect('/Login');
};
