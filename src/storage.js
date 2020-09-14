const { getFullKey, getShortKey } = require('./helpers');

module.exports = function wrapAsyncStorage(name, AsyncStorage) {
  const setItem = async (key = '', value = null) => {
    try {
      const fullKey = getFullKey(name, key);
      await AsyncStorage.setItem(fullKey, JSON.stringify(value));
      return Promise.resolve(true);
    } catch (e) {
      throw new Error(e);
    }
  };

  const getItem = async (key = '') => {
    try {
      const fullKey = getFullKey(name, key);
      const data = await AsyncStorage.getItem(fullKey);
      return JSON.parse(data);
    } catch (e) {
      throw new Error(e);
    }
  };

  const multiGet = async (keys = []) => {
    try {
      const fullKeys = keys.map((key) => getFullKey(name, key));
      const data = await AsyncStorage.multiGet(fullKeys);
      return data.reduce((acc, [key, value]) => ({
        ...acc,
        [getShortKey(name, key)]: JSON.parse(value),
      }), {});
    } catch (e) {
      throw new Error(e);
    }
  };

  const multiSet = async (dataObject = {}) => {
    try {
      const pairs = Object
        .entries(dataObject)
        .map(([key, value]) => [getFullKey(name, key), JSON.stringify(value)]);

      await AsyncStorage.multiSet(pairs);
      return Promise.resolve(true);
    } catch (e) {
      throw new Error(e);
    }
  };

  return {
    getItem,
    setItem,
    multiGet,
    multiSet,
  };
};
