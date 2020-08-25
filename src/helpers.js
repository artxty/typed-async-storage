const capitalize = (string = '') => {
  const [firstLetter, ...rest] = string.split('');
  return [firstLetter.toUpperCase(), ...rest].join('');
};

const getStorageFullName = (key = '') => `${key}Storage`;

const getFullKey = (storageName, key) => `@${storageName}-${key}`;

module.exports = {
  capitalize,
  getStorageFullName,
  getFullKey,
};
