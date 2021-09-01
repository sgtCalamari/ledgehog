const pug = require('pug');
const db = require('../services/db');

// GET
module.exports.balanceSummary = async (req, res) => {
  console.log('routing to balanceSummary');
  const balanceSummaryQuery = db.getBalanceSummary();
  balanceSummaryQuery
    .then(result => res.send(pug.renderFile('./app/balanceSummary.pug', result)));
};
