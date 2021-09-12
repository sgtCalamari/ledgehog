// GET
module.exports.getLoginPage = async (req, res) => {
  console.log('routing to login page');
  res.render('./app/login.pug');
};

// POST
module.exports.postLoginPage = async (req, res, next) => {
  console.log('handling requested user login');

  res.redirect('/');
};
