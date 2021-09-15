const ObjectId = require('mongodb').ObjectId;

// GET
module.exports.accountDetails = async (req, res) => {
  console.log('routing to specific account details');
  const db = require('../services/db')(req.session.passport.user || process.env.DB_NAME);
  var accountDetailsQuery = db.getAccountDetails(req.params.accountId);
  accountDetailsQuery.then(result => {
    result.title = `${result.accountName} | Account Details`;
    res.render('accountDetails.pug', result);
  });
};
module.exports.createTxDetails = async (req, res) => {
  console.log('routing to create transaction for specific account page');
  const db = require('../services/db')(req.session.passport.user || process.env.DB_NAME);
  var createTxDetailsQuery = db.getCreateTransactionDetails(req.params.accountId);
  createTxDetailsQuery.then(result => res.render('createTransaction.pug', result));
};
module.exports.modifyTxDetails = async (req, res) => {
  console.log('routing to modify specific transaction page');
  const db = require('../services/db')(req.session.passport.user || process.env.DB_NAME);
  var modifyTxDetailsQuery = db.getModifyTransactionDetails(req.params.accountId, req.params.transactionId);
  modifyTxDetailsQuery.then(result => {
    result.title = `${result.transaction.description} | Modify Transaction`;
    res.render('modifyTransaction.pug', result);
  });
};

// POST
module.exports.createTx = async (req, res) => {
  console.log('attempting to add new transaction to database');
  const db = require('../services/db')(req.session.passport.user || process.env.DB_NAME);
  // attempt add transaction to db
  const txAccount = new ObjectId(req.params.accountId);
  const txDate = new Date(req.body.date);
  const txDesc = req.body.description;
  const txCategory = req.body.category;
  const txAmount = parseFloat(req.body.amount.replace(",", ""));
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
  const db = require('../services/db')(req.session.passport.user || process.env.DB_NAME);
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
