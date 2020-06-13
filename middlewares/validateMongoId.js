const mongoose = require("mongoose");
const { get, throwError } = require("../helpers/generalHelpers");
const { UnProccessableEntityError } = require("../errors/ErrorsFactory")();

const validateMongoId = (idSource) => (properyName) => (req, res, next) =>
  mongoose.isValidObjectId(get(`${idSource}.${properyName}`)(req))
    ? next()
    : throwError(UnProccessableEntityError());

module.exports = {
  validateMongoIdFromParams: validateMongoId("params"),
};
