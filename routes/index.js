const express = require('express');

const app = express();
app.displayName = 'Ledgehog';
app.localPort = 8080;

// app routes
const balanceSummary = require('./balanceSummary');
app.use('/balanceSummary', balanceSummary);

const accountDetails = require('./accountDetails');
app.use('/accountDetails', accountDetails);

// default route
app.get('*', function(req, res) {
  console.log('default route reached, routing to balanceSummary');
  res.redirect('/balanceSummary');
});

module.exports = app;
