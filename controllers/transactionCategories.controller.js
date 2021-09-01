const pug = require('pug');
const db = require('../services/db');

// GET
module.exports.transactionCategories = async (req, res) => {
  console.log('routing to transaction categories summary');
  var transactionCategoriesQuery = db.getTransactionCategoriesSummary();
  transactionCategoriesQuery.then(result => {
    if (req.headers.referer) {
      result.originalUrl = req.headers.referer.indexOf('AccountDetails') !== -1 ?
        req.headers.referer :
        '/';
    } else { result.originalUrl = '/'; }
    res.send(pug.renderFile('./app/transactionCategories.pug', result));
  });
};
module.exports.createCategoryDetails = async (req, res) => {
  console.log('routing to create transaction category screen');
  var createCategoryDetailsQuery = db.getCreateCategoryDetails();
  createCategoryDetailsQuery.then(result => {
    res.send(pug.renderFile('./app/createCategory.pug', result));
  });
};

// POST
module.exports.createCategory = async (req, res) => {
  // add document to mongo
  var newCategory = {
    parentCategory: req.body.parentCategory,
    description: req.body.category
  };
  if (newCategory.parentCategory === '') {
    newCategory.parentCategory = req.body.parentCategorySelect;
  }
  db.createCategory(newCategory)
    .then(result => res.redirect('/TransactionCategories/CreateCategory'));
};
