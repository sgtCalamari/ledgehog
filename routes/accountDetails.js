const express = require('express');
const ObjectId = require('mongodb').ObjectId;
const pug = require('pug');
const db = require('../services/db');
const router = express.Router();

// GET account details by account id
router.get('/:accountId', function(req, res) {
  console.log('routing to specific account details');
  var accountDetailsQuery = db.getAccountDetails(req.params.accountId);
  accountDetailsQuery.then(result => {
    res.send(pug.renderFile('./app/accountDetails.pug', result));
  }, err=>{});
});

// GET create new transaction for account
router.get('/:accountId/CreateTransaction', function(req, res) {
  console.log('routing to create transaction for specific account page');
  var createTxDetailsQuery = db.getCreateTransactionDetails(req.params.accountId);
  createTxDetailsQuery.then(result => {
    res.send(pug.renderFile('./app/createTransaction.pug', result));
  }, err => {});
});

// POST create new transaction for account
router.post('/:accountId', function(req, res) {
  console.log('attempting to add new transaction to database');
  // attempt add transaction to db
  const txAccount = new ObjectId(req.params.accountId);
  const txDate = new Date(req.body.date);
  const txDesc = req.body.description;
  const txCategory = req.body.category;
  const txAmount = req.body.amount;
  const newTransaction = {
    date: txDate ?? new Date(),
    account: txAccount,
    description: txDesc,
    category: txCategory,
    amount: txAmount
  };
  db.createTransaction(newTransaction)
    .then(result => res.redirect('/AccountDetails/' + req.params.accountId));
});

module.exports = router;
