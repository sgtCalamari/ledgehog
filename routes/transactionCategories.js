const express = require('express');
const pug = require('pug');
const db = require('../services/db');
const router = express.Router();

// GET transaction categories summary
router.get('/', function(req, res) {
  console.log('routing to transaction categories summary');
  var transactionCategoriesQuery = db.getTransactionCategoriesSummary();
  transactionCategoriesQuery.then(result => {
    res.send(pug.renderFile('./app/transactionCategories.pug', result));
  }, err=>{});
});

// GET new transaction entry screen
router.get('/CreateCategory', function(req, res) {
  console.log('routing to create transaction category screen');
  var createCategoryDetailsQuery = db.getCreateCategoryDetails();
  createCategoryDetailsQuery.then(result => {
    res.send(pug.renderFile('./app/createCategory.pug', result));
  });
});

// POST create new category
router.post('/CreateCategory', function(req, res) {
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
});

module.exports = router;
