require('dotenv').config();

// GET
module.exports.transactionCategories = async (req, res) => {
  console.log('routing to transaction categories summary');
  const db = require('../services/db')(req.session.passport.user || process.env.DB_NAME);
  var transactionCategoriesQuery = db.getTransactionCategoriesSummary();
  transactionCategoriesQuery.then(result => {
    if (req.headers.referer) {
      result.originalUrl = req.headers.referer.indexOf('AccountDetails') !== -1 ?
        req.headers.referer :
        '/';
    } else { result.originalUrl = '/'; }
    res.render('transactionCategories.pug', result);
  });
};
module.exports.createCategoryDetails = async (req, res) => {
  console.log('routing to create transaction category screen');
  const db = require('../services/db')(req.session.passport.user || process.env.DB_NAME);
  var createCategoryDetailsQuery = db.getCreateCategoryDetails();
  createCategoryDetailsQuery.then(r => res.render('createCategory.pug', r));
};

// POST
module.exports.createCategory = async (req, res) => {
  const db = require('../services/db')(req.session.passport.user || process.env.DB_NAME);
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
