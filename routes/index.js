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
  res.redirect('/balanceSummary');
});

app.listen(app.localPort, () => {
  console.log(`Node Express server for ${app.displayName} listening at http://localhost:${app.localPort}`);
});

module.exports = app;
