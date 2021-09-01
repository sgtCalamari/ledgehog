const controller = require('../controllers/createAccount.controller');
const router = require('express').Router();

// GET create account page
router.get('/', controller.createAccountDetails);
// POST create new account
router.post('/', controller.createAccount);

module.exports = router;
