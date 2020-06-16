const { get } = require("verylodash");
const { AuthorizationError } = require("../errors/ErrorsFactory")();
const errorFactory = require("../errors/ErrorsFactory");
module.exports = ({ Model, userIdPath }) => (docIdPathFromReq) => async (
  req,
  res,
  next
) => {
  const userId = get("user._id")(req);
  const docId = get(docIdPathFromReq)(req);
  const requestedDoc = await Model.findById(docId);
  if (!requestedDoc) throw errorFactory(Model.modelName).NotFoundError(docId);
  const docOwner = get(userIdPath)(requestedDoc).toHexString();
  if (docOwner !== userId) throw AuthorizationError();
  Object.assign(req, { requestedDoc });
  return next();
};
