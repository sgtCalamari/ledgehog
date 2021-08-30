const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.displayName = 'Ledgehog';
app.localPort = 8080;

// middleware
app.use(bodyParser.urlencoded({extended: true}));

// app routes
const balanceSummary = require('./balanceSummary');
app.use('/BalanceSummary', balanceSummary);

const accountDetails = require('./accountDetails');
app.use('/AccountDetails', accountDetails);

const txCategories = require('./transactionCategories');
app.use('/TransactionCategories', txCategories);

// default route
app.get('*', function(req, res) {
  res.redirect('/BalanceSummary');
});

module.exports = app;
