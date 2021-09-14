const router = require('express').Router();
const controller = require('../controllers/logout.controller');

// GET logout route
router.get('/', controller.logout);

module.exports = router;
