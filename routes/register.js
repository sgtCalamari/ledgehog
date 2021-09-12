const router = require('express').Router();
const controller = require('../controllers/register.controller');

// GET login page
router.get('/', controller.getRegisterPage);
// POST handle user login
router.post('/', controller.postRegisterPage);

module.exports = router;
