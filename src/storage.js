const { getFullKey } = require('./helpers');

module.exports = function createAsyncStorage(name, asyncStorageInstance) {
  const setItem = async (key = '', value = null) => {
    try {
      const fullKey = getFullKey(name, key);
      await asyncStorageInstance.setItem(fullKey, JSON.stringify(value));
      return Promise.resolve(true);
    } catch (e) {
      throw new Error(e);
    }
  };

  const getItem = async (key = '') => {
    try {
      const fullKey = getFullKey(name, key);
      const data = await asyncStorageInstance.getItem(fullKey);
      return JSON.parse(data);
    } catch (e) {
      throw new Error(e);
    }
  };

  return { getItem, setItem };
};
