const express = require('express');
const pug = require('pug');
const db = require('../services/test_db');
const router = express.Router();

// home page routes
router.get('/', function(req, res) {
  res.send(pug.renderFile('./app/accountDetails.pug', db.getAccountDetails()));
});

module.exports = router;
