const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const uri = require('../config/db.config').uri;
const client = new MongoClient(uri);
const database = client.db('ledger');

// accounts queries
async function getAccountNameById(client, accountId) {
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

// transactions queries
async function getTransactionsForAccount(client, accountId) {
  console.log(`begin query for transactions by account id: ${accountId}`);
  // transactions query
  const transactions = database.collection('transactions');
  const query = { account: new ObjectId(accountId) };
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
  var allValues = await cursor.toArray();
  return allValues.map(t => {
    return {
      date: t.date ? t.date.toDateString() : '',
      description: t.description ?? '',
      category: t.category ?? '',
      amount: t.amount ?? 0
    };});
}

// transactionTypes queries
async function getUniqueCategories(client) {
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
async function getCategoriesByParentCategory(client) {
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
    const accountName = await getAccountNameById(client, accountId);
    const transactions = await getTransactionsForAccount(client, accountId);
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
  return null;
}
async function getCreateTransactionDetails(accountId) {
  /* returns object with:
  accountId: String,
  accountName: String,
  categories: Array<String>
  */
  try {
    await client.connect();
    const accountName = await getAccountNameById(client, accountId);
    const categories = await getUniqueCategories(client);
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
    const categories = await getCategoriesByParentCategory(client);
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
    const categories = await getCategoriesByParentCategory(client);
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
