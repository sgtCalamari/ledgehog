const passport = require('passport');

// GET
module.exports.getLoginPage = async (req, res) => {
  console.log('routing to login page');
  res.render('login.pug', {error: req.query.error});
};

// POST
module.exports.postLoginPage = passport.authenticate('local', {
  failureRedirect: '/Login?error=loginFailed',
  successRedirect: '/BalanceSummary'
});
