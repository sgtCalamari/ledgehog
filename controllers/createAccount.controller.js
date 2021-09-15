const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();

// GET
module.exports.createAccountDetails = async (req, res) => {
  console.log('routing to create new account page');
  res.render('createAccount.pug');
};

// POST
module.exports.createAccount = async (req, res) => {
  console.log('attempting to add new account to database');
  const db = require('../services/db')(req.session.passport.user || process.env.DB_NAME);
  // attempt add new document to db
  const name = req.body.accountName;
  const admin = req.body.accountAdmin;
  const balance = parseFloat(req.body.accountBalance);
  const newAccount = {
    name: name,
    administrator: admin,
    balance: balance
  };
  if (req.body.creditLimit) newAccount.limit = parseFloat(req.body.creditLimit);
  db.createAccount(newAccount)
    .then(result => {
      console.log('account added:');
      console.log(newAccount);
      res.redirect('/');
    });
};
