const router = require('express').Router();
const controller = require('../controllers/createAccount.controller');

// GET create account page
router.get('/', controller.createAccountDetails);
// POST create new account
router.post('/', controller.createAccount);

module.exports = router;
