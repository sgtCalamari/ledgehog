const express = require('express');
const pug = require('pug');
const db = require('../services/db');
const router = express.Router();

// home page routes
router.get('/:accountId', function(req, res) {
  console.log('routing to specific account details');
  var accountDetailsQuery = db.getAccountDetails(req.params.accountId);
  accountDetailsQuery.then(function(result) {
    res.send(pug.renderFile('./app/accountDetails.pug', result));
  }, function(err){});
});

module.exports = router;
