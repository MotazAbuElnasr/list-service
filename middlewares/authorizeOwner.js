const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const { get } = require("../helpers/generalHelpers");
const { AuthorizationError } = require("../errors/ErrorsFactory")();
module.exports = ({ Model, userIdPath }) => (userIdPathFromRequest) => async (
  req,
  res,
  next
) => {
  const userId = get("user._id")(req);
  const requestedDoc = await Model.findOne({
    [userIdPath]: get(userIdPathFromRequest)(req),
  });
  const docOwner = get(userIdPath)(requestedDoc);
  if (docOwner !== userId) throw AuthorizationError();
  return next();
};
