const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const verifyJWT = promisify(jwt.verify);
const { jwtSecret } = require("../config");
const { AuthenticationError } = require("../errors/ErrorsFactory")();
module.exports = async (req, res, next) => {
  const { token } = req.headers;
  try {
    req.user = await verifyJWT(token, jwtSecret);
    return next();
  } catch (error) {
    console.error(error);
    throw AuthenticationError(error.message);
  }
};
