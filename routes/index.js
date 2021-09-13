const express = require('express');
const app = express();

// routers
const balanceSummary = require('./balanceSummary');
const accountDetails = require('./accountDetails');
const txCategories = require('./transactionCategories');
const createAccount = require('./createAccount');
const login = require('./login');
const register = require('./register');

// before auth routes
app.use('/Login', login);
app.use('/Register', register);

// middleware
const auth = require('./auth.middleware');
app.use(auth.isAuth);

// app routes
app.use('/BalanceSummary', balanceSummary);
app.use('/AccountDetails', accountDetails);
app.use('/TransactionCategories', txCategories);
app.use('/CreateAccount', createAccount);

// default routes
app.get('/', function(req, res) {
  res.redirect('/Login');
});
app.get('*', function(req, res) {
  // TODO: what goes here?
});

module.exports = app;
