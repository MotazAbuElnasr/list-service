class CustomError extends Error {
  constructor(status, code, message, details = []) {
    super();
    Object.assign(this, {
      status,
      code,
      details,
      message,
    });
  }
}

module.exports = (modelName) => ({
  NotFoundError: (id) =>
    new CustomError(404, "NOT_FOUND", `${modelName} of id ${id} doesn't exist`),
  UnProccessableEntityError: () =>
    new CustomError(422, "INVALID_DATA", "Invalid request data"),
  AuthorizationError: (message) =>
    new CustomError(403, "UNAUTHORIZED", message),
  AuthenticationError: (message) =>
    new CustomError(401, "AUTHENTICATION", message),
});
