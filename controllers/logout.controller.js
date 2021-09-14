// GET
module.exports.logout = async (req, res) => {
  console.log('starting logout');
  req.logout();
  res.redirect('/');
};
