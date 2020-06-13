module.exports = {
  pick: (keys) => (obj) =>
    keys.reduce(
      (agg, key) => ({ ...agg, ...(obj[key] && { [key]: obj[key] }) }),
      {}
    ),
};
