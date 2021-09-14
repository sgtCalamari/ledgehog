module.exports.isAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    console.log('user not logged in');
    try {
      res.status(401);
    } catch {}
    res.redirect('/Login');
  }
};

module.exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.admin) {
    next();
  } else {
    res.status(401).json({ msg: 'You are not an admin.' });
  }
};
