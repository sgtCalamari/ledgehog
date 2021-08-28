const express = require('express');
const pug = require('pug');
const db = require('../services/test_db');
const router = express.Router();

// home page route
router.get('/', function(req, res) {
  res.send(pug.renderFile('./app/balanceSummary.pug', db.getBalanceSummary()));
});

module.exports = router;
