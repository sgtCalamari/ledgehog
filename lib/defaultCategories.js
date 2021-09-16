const defaultCategories = require('./transactionTypes.json');

module.exports.defaultCategories = defaultCategories.map(c => {
  var parentCategory = c.parentCategory;
  var description = c.description;
  return {parentCategory, description};
});
