const router = require('express').Router();
const controller = require('../controllers/login.controller');
const passport = require('passport');

// GET login page
router.get('/', controller.getLoginPage);
// POST handle user login
router.post('/', passport.authenticate('local', {failureRedirect: '/Login', successRedirect: '/BalanceSummary' }));
router.post('/', controller.postLoginPage);

module.exports = router;
