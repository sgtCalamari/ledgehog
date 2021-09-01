const pug = require('pug');
const ObjectId = require('mongodb').ObjectId;
const db = require('../services/db');

// GET
module.exports.accountDetails = async (req, res) => {
  console.log('routing to specific account details');
  var accountDetailsQuery = db.getAccountDetails(req.params.accountId);
  accountDetailsQuery.then(result =>
    res.send(pug.renderFile('./app/accountDetails.pug', result))
  );
};
module.exports.createTxDetails = async (req, res) => {
  console.log('routing to create transaction for specific account page');
  var createTxDetailsQuery = db.getCreateTransactionDetails(req.params.accountId);
  createTxDetailsQuery.then(result =>
    res.send(pug.renderFile('./app/createTransaction.pug', result))
  );
};
module.exports.modifyTxDetails = async (req, res) => {
  console.log('routing to modify specific transaction page');
  var modifyTxDetailsQuery = db.getModifyTransactionDetails(req.params.accountId, req.params.transactionId);
  modifyTxDetailsQuery.then(result =>
    res.send(pug.renderFile('./app/modifyTransaction.pug', result))
  );
};

// POST
module.exports.createTx = async (req, res) => {
  console.log('attempting to add new transaction to database');
  // attempt add transaction to db
  const txAccount = new ObjectId(req.params.accountId);
  const txDate = new Date(req.body.date);
  const txDesc = req.body.description;
  const txCategory = req.body.category;
  const txAmount = parseFloat(req.body.amount);
  const isDeposit = req.body.isDeposit === 'checked';
  const newTransaction = {
    date: txDate ?? new Date(),
    account: txAccount,
    description: txDesc,
    category: txCategory,
    amount: txAmount,
    isDeposit: isDeposit
  };
  db.createTransaction(newTransaction)
    .then(result => {
      console.log('transaction added:');
      console.log(newTransaction);
      res.redirect('/AccountDetails/' + req.params.accountId);
    });
};
module.exports.modifyTx = async (req, res) => {
  console.log(`attempting to modify transaction _id: ${req.params.transactionId}`);
  // attempt update document
  const txId = new ObjectId(req.params.transactionId);
  const txDate = new Date(req.body.date);
  const txDesc = req.body.description;
  const txCategory = req.body.category;
  const txAmount = parseFloat(req.body.amount);
  const isDeposit = req.body.isDeposit === 'checked';
  var modifyTransaction = {
    id: txId,
    update: {
      date: txDate,
      description: txDesc,
      category: txCategory,
      isDeposit: isDeposit,
      amount: txAmount
    }
  };
  db.modifyTransaction(modifyTransaction)
    .then(result => {
      console.log('transaction updated');
      console.log(result);
      res.redirect('/AccountDetails/' + req.params.accountId);
    });
};
