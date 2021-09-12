const db = require('../services/db');

// GET
module.exports.balanceSummary = async (req, res) => {
  console.log('routing to balanceSummary');
  const balanceSummaryQuery = db.getBalanceSummary();
  balanceSummaryQuery
    .then(result => res.render('balanceSummary.pug', result));
};
