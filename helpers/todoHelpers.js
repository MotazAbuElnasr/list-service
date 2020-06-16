const ReadOnlyUser = require("../models/ReadOnlyUser");

const doesUserExist = (userId) => ReadOnlyUser.findOne({ _id: userId });

module.exports = {
  doesUserExist,
};
