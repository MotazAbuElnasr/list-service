module.exports = {
  pick: (keys) => (obj) =>
    keys.reduce(
      (agg, key) => ({ ...agg, ...(obj[key] && { [key]: obj[key] }) }),
      {}
    ),
  get: (path) => (obj) =>
    path
      .split(".")
      .reduce((agg, key) => (agg ? agg[key] || undefined : undefined), obj),
  throwError: (err) => {
    throw err;
  },
};
