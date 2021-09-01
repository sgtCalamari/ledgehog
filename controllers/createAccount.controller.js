const pug = require('pug');
const ObjectId = require('mongodb').ObjectId;
const db = require('../services/db');

// GET
module.exports.createAccountDetails = async (req, res) => {
  console.log('routing to create new account page');
  res.send(pug.renderFile('./app/createAccount.pug'),{title: 'Create Account'});
};

// POST
module.exports.createAccount = async (req, res) => {
  console.log('attempting to add new account to database');
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
