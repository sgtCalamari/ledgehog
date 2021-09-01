const router = require('express').Router();
const controller = require('../controllers/accountDetails.controller');

// GET account details by account id
router.get('/:accountId', controller.accountDetails);
// GET create new transaction for account
router.get('/:accountId/CreateTransaction', controller.createTxDetails);
// POST create new transaction for account
router.post('/:accountId', controller.createTx);
// GET modify transaction detail screen
router.get('/:accountId/ModifyTransaction/:transactionId', controller.modifyTxDetails);
// POST modify transaction for id
router.post('/:accountId/ModifyTransaction/:transactionId', controller.modifyTx);

module.exports = router;
