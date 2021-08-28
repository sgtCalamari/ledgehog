const express = require('express');
const pug = require('pug');
const db = require('../services/test_db');
const router = express.Router();

// home page route
router.get('/', function(req, res) {
  console.log('routing to balanceSummary');
  const balanceSummary = db.getBalanceSummary();
  res.send(pug.renderFile('./app/balanceSummary.pug', balanceSummary));
});

module.exports = router;
