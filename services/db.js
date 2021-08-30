const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const uri = require('../config/db.config').uri;
const client = new MongoClient(uri);
const database = client.db('ledger');

// accounts queries
async function getAccountNameById(accountId) {
  console.log(`begin query for account name by id: ${accountId}`);
  // accounts query
  const accounts = database.collection('accounts');
  const myAccount = await accounts.findOne({_id: new ObjectId(accountId)});
  if (!myAccount) {
    console.error('unable to find account');
    return;
  }
  const accountName = `${myAccount.administrator} ${myAccount.name}`.trim();
  console.log(`account found: ${accountName}`);
  return accountName;
}
async function getAccounts(query, options) {
  console.log('begin query for accounts');
  // accounts query
  const collection = database.collection('accounts');
  const cursor = await collection.find(query, options);
  const accountsFound = await cursor.count();
  if (accountsFound === 0) {
    console.log('no accounts found');
    return;
  }
  console.log(`${accountsFound} accounts found`);
  return await cursor.toArray();
}

// transactions queries
async function getTransactionsForAccount(accountId) {
  console.log(`begin query for transactions by account id: ${accountId}`);
  // transactions query
  const query = { account: new ObjectId(accountId) };
  return await getTransactions(query);
}
async function getTransactions(query, options) {
  console.log(`begin query for transactions`);
  // transactions query
  const transactions = database.collection('transactions');
  const cursor = await transactions.find(query, options);
  const transactionsFound = await cursor.count();
  if (transactionsFound === 0) {
    console.log(`no transactions found`);
    return;
  }
  console.log(`${transactionsFound} transactions found`);
  var allValues = await cursor.toArray();
  return allValues.map(t => {
    amount = Number.parseFloat(t.amount);
    return {
      date: t.date ? t.date.toDateString() : '',
      description: t.description ?? '',
      category: t.category ?? '',
      amount: amount,
      isDeposit: t.isDeposit
    };
  });
}

// transactionTypes queries
async function getUniqueCategories() {
  console.log('begin query for unique categories');
  // transactionTypes query
  const txTypes = database.collection('transactionTypes');
  const myTypes = await txTypes.find();
  const typesFound = await myTypes.count();
  if (typesFound === 0) {
    console.error('unable to find any categories');
    return [];
  }
  var allValues = await myTypes.toArray();
  return allValues
    .map(v => `${v.description} (${v.parentCategory})`)
    .filter((v, i, a) => a.indexOf(v) === i);
}
async function getCategoriesByParentCategory() {
  console.log('begin query for transaction categories by parent category');
  // transactionTypes query
  const txTypes = database.collection('transactionTypes');
  const myTypes = await txTypes.find();
  var allValues = await myTypes.toArray();
  var parentCategories = allValues.map(c => c.parentCategory).filter((v, i, a) => a.indexOf(v) === i);
  return parentCategories.map(pc => {
    return {
      parentCategory: pc,
      subcategories: allValues.filter(v => v.parentCategory === pc).map(v => v.description).sort()
  }});
}

// helper functions
function formatTransactions(transactions) {
  console.log('formatting transactions for display');
  return transactions.map(t => {
    return {
      date: t.date,
      description: t.description,
      category: t.category,
      amount: (t.isDeposit ? t.amount : -1 * t.amount)
    }});
}
function formatAccountBalanceSummary(account, transactions) {
  console.log(`formatting balance summary for ${account.administrator} ${account.name}`);
  var balanceSummary = {
    accountId: account._id,
    accountAdmin: account.administrator,
    accountName: account.name
  };
  balanceSummary.lastTxDate = transactions.map(t => t.date).sort().pop();
  var totalDeposits = 0;
  var totalWithdrawals = 0;
  const deposits = transactions.filter(t => t.isDeposit);
  if (deposits.length > 0) {
    console.log(`${deposits.length} deposits found`);
    totalDeposits += deposits.map(t => t.amount).reduce((a, c) => a + c);
  }
  const withdrawals = transactions.filter(t => !t.isDeposit);
  if (withdrawals.length > 0) {
    console.log(`${withdrawals.length} withdrawals found`);
    totalWithdrawals += withdrawals.map(t => t.amount).reduce((a, c) => a + c);
  }
  if (account.limit) {
    balanceSummary.balance = (account.balance + totalWithdrawals - totalDeposits).toFixed(2);
    balanceSummary.credit = (account.limit - balanceSummary.balance).toFixed(2);
  } else {
    balanceSummary.balance = (account.balance + totalDeposits - totalWithdrawals).toFixed(2);
  }
  return balanceSummary;
}

// module functions
async function getAccountDetails(accountId) {
  /* returns object with:
  accountId: String,
  accountName: String,
  transactions: Array<Object>
    date: Date
    desc: String
    category: String
    amount: Number
  */
  console.log(`begin account details query for id: ${accountId}`);
  try {
    await client.connect();
    const accountName = await getAccountNameById(accountId);
    const transactions = formatTransactions(await getTransactionsForAccount(accountId));
    return {
      accountId: accountId,
      accountName: accountName,
      transactions: transactions
    };
  } finally {
    await client.close();
  }
}
async function getBalanceSummary() {
  /* returns object with:
  accountDetails: Array<Object>
    accountId: String
    lastTxDate: Date
    accountAdmin: String
    accountName: String
    balance: Number
    credit: Number
  */
  console.log(`begin balance summary details`);
  try {
    await client.connect();
    const accounts = await getAccounts();
    var results = [];
    for (var i = 0;i < accounts.length;i++) {
      const transactions = await getTransactionsForAccount(accounts[i]._id);
      const balanceSummary = formatAccountBalanceSummary(accounts[i], transactions);
      results.push(balanceSummary);
    }
    return {
      accountDetails: results.sort(r => r.accountName)
    };
  } finally {
    await client.close();
  }
}
async function getCreateTransactionDetails(accountId) {
  /* returns object with:
  accountId: String,
  accountName: String,
  categories: Array<String>
  */
  try {
    await client.connect();
    const accountName = await getAccountNameById(accountId);
    const categories = await getUniqueCategories();
    return {
      accountId: accountId,
      accountName: accountName,
      categories: categories.sort()
    };
  } finally {
    await client.close();
  }
}
async function createTransaction(transactionDetails) {
  /* accepts object with:
  date: Date
  account: String
  description: String
  category: String
  amount: Number
  location: String (optional)
  */
  console.log('begin create transaction');
  try {
    await client.connect();
    // transactions query
    const transactions = database.collection('transactions');
    const result = await transactions.insertOne(transactionDetails);
    console.log(`document added with _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}
async function getTransactionCategoriesSummary() {
  /* returns object with:
  categories: Array<Object>
    parentCategory: String
    parentId: String
    subcategories: Array<String>
  */
  try {
    await client.connect();
    const categories = await getCategoriesByParentCategory();
    categories.forEach((c, i) => {
      c.parentId = i;
    });
    return {
      categories: categories
    };
  } finally {
    await client.close();
  }
}
async function getCreateCategoryDetails() {
  /* returns object with:
  parentCategories: Array<String>
  */
  try {
    await client.connect();
    const categories = await getCategoriesByParentCategory();
    return {
      parentCategories: categories.map(c => c.parentCategory).filter((v, i, a) => a.indexOf(v) === i)
    };
  } finally {
    await client.close();
  }
}
async function createCategory(categoryDetails) {
  /* accepts object with:
  description: String
  parentCategory: String
  */
  console.log('begin create transaction category');
  try {
    await client.connect();
    // transactionTypes query
    const transactionTypes = database.collection('transactionTypes');
    const result = await transactionTypes.insertOne(categoryDetails);
    console.log(`document added with _id: ${result.insertedId}`);
  } finally {
    await client.close();
  }
}

module.exports = {
  getAccountDetails,
  getBalanceSummary,
  getCreateTransactionDetails,
  createTransaction,
  getTransactionCategoriesSummary,
  getCreateCategoryDetails,
  createCategory
};
