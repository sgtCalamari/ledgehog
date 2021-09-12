const crypto = require('crypto');

function hashPassword(password) {
  var salt = crypto.randomBytes(32).toString('hex');
  var hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

  return {
    salt: salt,
    hash: hash
  };
}

function isValidPassword(password, hash, salt) {
  var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

module.exports = {
  hashPassword,
  isValidPassword
}
