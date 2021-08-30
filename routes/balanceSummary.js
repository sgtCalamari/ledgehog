const express = require('express');
const pug = require('pug');
const db = require('../services/db');
const router = express.Router();

// home page route
router.get('/', function(req, res) {
  console.log('routing to balanceSummary');
  const balanceSummaryQuery = db.getBalanceSummary();
  balanceSummaryQuery
    .then(result => res.send(pug.renderFile('./app/balanceSummary.pug', result)));
});

module.exports = router;
