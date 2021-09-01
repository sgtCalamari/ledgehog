const router = require('express').Router();
const controller = require('../controllers/transactionCategories.controller');

// GET transaction categories summary
router.get('/', controller.transactionCategories);
// GET new transaction entry screen
router.get('/CreateCategory', controller.createCategoryDetails);
// POST create new category
router.post('/CreateCategory', controller.createCategory);

module.exports = router;
