const router = require('express').Router();
const controller = require('../controllers/balanceSummary.controller');

// GET home page route
router.get('/', controller.balanceSummary);

module.exports = router;
