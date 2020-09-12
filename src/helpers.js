const capitalize = (string = '') => {
  const [firstLetter, ...rest] = string.split('');
  return [firstLetter.toUpperCase(), ...rest].join('');
};

const getStorageFullName = (key = '') => `${key}Storage`;

const getFullKey = (storageName, key) => `@${storageName}-${key}`;
const getShortKey = (storageName, fullKey) => fullKey.split(`@${storageName}-`)[1];

module.exports = {
  capitalize,
  getStorageFullName,
  getFullKey,
  getShortKey,
};
