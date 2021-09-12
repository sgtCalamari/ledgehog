require('dotenv').config();
const uri = process.env.DB_STRING;
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;
const client = new MongoClient(uri);
const database = client.db(process.env.DB_NAME);

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
async function getTransactionById(transactionId) {
  console.log(`begin query for transaction by id: ${transactionId}`);
  // transactions query
  const collection = database.collection('transactions');
  const query = { _id: new ObjectId(transactionId) };
  const tx = await collection.findOne(query);
  if (!tx) {
    console.error('unable to find transaction');
    return;
  }
  return tx;
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
  await cursor.sort({date: 1});
  console.log(`${transactionsFound} transactions found`);
  var allValues = await cursor.toArray();
  return allValues.map(t => {
    amount = Number.parseFloat(t.amount);
    return {
      _id: t._id,
      date: t.date,
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
  await myTypes.sort({description: 1});
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
  await myTypes.sort({parentCategory: 1});
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
  if (!transactions) return [];
  return transactions.reverse().map(t => {
    return {
      id: t._id,
      date: t.date.toUTCString().replace(' 00:00:00 GMT', ''),
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
  var totalDeposits = 0;
  var totalWithdrawals = 0;
  if (transactions) {
    balanceSummary.lastTxDate = formatDate(transactions
      .map(t => t.date)
      .sort(t => t)
      .pop());
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
  } else {
    balanceSummary.lastTxDate = 'No transactions';
  }
  if (account.limit) {
    balanceSummary.balance = (account.balance + totalWithdrawals - totalDeposits).toFixed(2);
    balanceSummary.credit = (account.limit - balanceSummary.balance).toFixed(2);
  } else {
    balanceSummary.balance = (account.balance + totalDeposits - totalWithdrawals).toFixed(2);
  }
  return balanceSummary;
}
function formatDate(date) {
  console.log(`formatting date: ${date.toUTCString()}`);
  var dayOfWeek;
  switch (date.getUTCDay()) {
    case 0:
      dayOfWeek = 'Sun';
      break;
    case 1:
      dayOfWeek = 'Mon';
      break;
    case 2:
      dayOfWeek = 'Tue';
      break;
    case 3:
      dayOfWeek = 'Wed';
      break;
    case 4:
      dayOfWeek = 'Thur';
      break;
    case 5:
      dayOfWeek = 'Fri';
      break;
    default:
      dayOfWeek = 'Sat';
      break;
  }
  return `${dayOfWeek} ${(date.getUTCMonth()+1)}/${date.getUTCDate()}/${date.getFullYear()}`;
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
    if (!accounts) return { accountDetails: [] };
    var results = [];
    for (var i = 0;i < accounts.length;i++) {
      const transactions = await getTransactionsForAccount(accounts[i]._id);
      const balanceSummary = formatAccountBalanceSummary(accounts[i], transactions);
      results.push(balanceSummary);
    }
    return {
      accountDetails: results.sort((a, b) => {
        var nameA = `${a.accountAdmin} ${a.accountName}`.toUpperCase();
        var nameB = `${b.accountAdmin} ${b.accountName}`.toUpperCase();
        if (nameA < nameB) {
          return -1;
        } else {
          return 1;
        } return 0;
      })
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
  console.log('begin get create transaction details');
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
  isDeposit: Boolean
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
async function getModifyTransactionDetails(accountId, transactionId) {
  /* returns object with:
  accountId: String
  accountName: String
  transaction: Object
    _id: String
    date: Date
    description: String
    category: String
    isDeposit: Boolean
    amount: Number
  categories: Array<String>
  */
  console.log('begin get modify transaction details');
  try {
    await client.connect();
    const categories = await getUniqueCategories();
    const transaction = await getTransactionById(transactionId);
    const accountName = await getAccountNameById(transaction.account);
    return {
      accountId: transaction.account,
      accountName: accountName,
      transaction: transaction,
      categories: categories
    };
  } finally {
    await client.close();
  }
}
async function modifyTransaction(transactionDetail) {
  /* accepts object with:
  id: ObjectId
  update: Object
    date: Date
    description: String
    category: String
    isDeposit: Boolean
    amount: Number
  */
  console.log('begin modify transaction');
  try {
    await client.connect();
    // transactions query
    const collection = database.collection('transactions');
    const query = { _id: transactionDetail.id };
    const update = { $set: transactionDetail.update };
    await collection.updateOne(query, update);
    console.log('document updated');
  } finally {
    await client.close();
  }
}
async function createAccount(accountDetails) {
  /* accepts object with:
  name: String
  administrator: String
  balance: Number
  limit: Number (optional)
  */
  console.log('begin create account query');
  try {
    await client.connect();
    // accounts query
    const collection = database.collection('accounts');
    const result = await collection.insertOne(accountDetails);
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
  createCategory,
  getModifyTransactionDetails,
  modifyTransaction,
  createAccount
};
