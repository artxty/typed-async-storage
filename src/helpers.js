const getFullKey = (storageName, key) => `@${storageName}-${key}`;
const getShortKey = (storageName, fullKey) => fullKey.split(`@${storageName}-`)[1];

module.exports = {
  getFullKey,
  getShortKey,
};
