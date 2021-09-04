const express = require('express');
const app = express();

// app routes
const balanceSummary = require('./balanceSummary');
app.use('/BalanceSummary', balanceSummary);
const accountDetails = require('./accountDetails');
app.use('/AccountDetails', accountDetails);
const txCategories = require('./transactionCategories');
app.use('/TransactionCategories', txCategories);
const createAccount = require('./createAccount');
app.use('/CreateAccount', createAccount);

// default routes
app.get('/', function(req, res) {
  res.redirect('/BalanceSummary');
});
app.get('*', function(req, res) {
  // TODO: what goes here?
});

module.exports = app;
