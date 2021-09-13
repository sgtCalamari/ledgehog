const passport = require('passport');

// GET
module.exports.getLoginPage = async (req, res) => {
  console.log('routing to login page');
  res.render('login.pug');
};

// POST
module.exports.postLoginPage = passport.authenticate('local', {
  failureRedirect: '/Login',
  successRedirect: '/BalanceSummary'
});
