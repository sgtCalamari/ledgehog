// GET
module.exports.balanceSummary = async (req, res) => {
  console.log('routing to balanceSummary');
  const db = require('../services/db')(req.session.passport.user || process.env.DB_NAME);
  const balanceSummaryQuery = db.getBalanceSummary();
  balanceSummaryQuery
    .then(result => res.render('balanceSummary.pug', result));
};
