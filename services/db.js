const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const uri = require('../config/db.config').uri;
const client = new MongoClient(uri);

function getBalanceSummary() {
  /* returns object with:
  accountDetails: Array<Object>
    accountId: String
    lastTxDate: Date
    accountAdmin: String
    accountName: String
    balance: Number
    credit: Number
  */
  return null;
}

async function getAccountDetails(accountId) {
  console.log(`begin query for account id: ${accountId}`);
  /* returns object with:
  accountName: String,
  transactions: Array<Object>
    date: Date
    desc: String
    category: String
    amount: Number
  */
  var accountDetails = {};
  try {
    await client.connect();
    const database = client.db('ledger');
    // accounts query
    const accounts = database.collection('accounts');
    const myAccount = await accounts.findOne({_id: new ObjectId(accountId)});
    if (!myAccount) {
      console.error('unable to find account');
      return;
    }
    const accountName = `${myAccount.administrator} ${myAccount.name}`.trim();
    console.log(`account found: ${accountName}`);
    accountDetails.accountName = accountName;
    // transactions query
    const transactions = database.collection('transactions');
    const query = { account: myAccount.name };
    const options = {
      sort: { date: 1 },
      projection: {
        _id: 1,
        date: 1,
        account: 1,
        description: 1,
        location: 1,
        category: 1,
        amount: 1
      }
    };
    const cursor = await transactions.find(query, options);
    const transactionsFound = await cursor.count();
    if (transactionsFound === 0) {
      console.log(`no transactions found for ${myAccount.name}`);
    }
    console.log(`${transactionsFound} transaction(s) found`);
    accountDetails.transactions = [];
    var allValues = await cursor.toArray();
    accountDetails.transactions = allValues.map(t => {
      return {
        date: t.date.toDateString(),
        description: t.description,
        category: t.category,
        amount: t.amount
      };});
  } finally {
    await client.close();
  }
  return accountDetails;
}

module.exports = {
  getAccountDetails,
  getBalanceSummary
};
