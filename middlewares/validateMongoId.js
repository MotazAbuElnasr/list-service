const mongoose = require("mongoose");
const { get, throwError } = require("verylodash");
const { UnProccessableEntityError } = require("../errors/ErrorsFactory")();

const validateMongoId = (idSource) => ({ property, optional }) => (
  req,
  res,
  next
) => {
  const id = get(`${idSource}.${property}`)(req);
  if (!id && optional) return next();
  return mongoose.isValidObjectId(id)
    ? next()
    : throwError(UnProccessableEntityError());
};
module.exports = {
  fromParams: validateMongoId("params"),
  fromBody: validateMongoId("body"),
};
