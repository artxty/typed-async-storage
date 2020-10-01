const { getFullKey, getShortKey } = require('./helpers');

module.exports = function wrapAsyncStorage(name, AsyncStorage) {
  const getAllKeys = async () => {
    const storagePrefix = getFullKey(name, '');
    const allKeys = await AsyncStorage.getAllKeys();
    return allKeys
      .filter((key) => key.startsWith(storagePrefix))
      .map((key) => getShortKey(name, key));
  };

  const setItem = async (key = '', value = null) => {
    const fullKey = getFullKey(name, key);
    await AsyncStorage.setItem(fullKey, JSON.stringify(value));
    return Promise.resolve(true);
  };

  const getItem = async (key = '') => {
    const fullKey = getFullKey(name, key);
    const data = await AsyncStorage.getItem(fullKey);
    return JSON.parse(data);
  };

  const mergeItem = async (key = '', value = null) => {
    const fullKey = getFullKey(name, key);
    await AsyncStorage.mergeItem(fullKey, JSON.stringify(value));
    return Promise.resolve(true);
  };

  const removeItem = async (key = '') => {
    const fullKey = getFullKey(name, key);
    await AsyncStorage.removeItem(fullKey);
    return Promise.resolve(true);
  };

  const multiGet = async (keys = []) => {
    const fullKeys = keys.map((key) => getFullKey(name, key));
    const data = await AsyncStorage.multiGet(fullKeys);
    return data.reduce(
      (acc, [key, value]) => ({
        ...acc,
        [getShortKey(name, key)]: JSON.parse(value),
      }),
      {},
    );
  };

  const multiSet = async (dataObject = {}) => {
    const pairs = Object.entries(dataObject).map(([key, value]) => [
      getFullKey(name, key),
      JSON.stringify(value),
    ]);

    await AsyncStorage.multiSet(pairs);
    return Promise.resolve(true);
  };

  const multiMerge = async (dataObject = {}) => {
    const pairs = Object.entries(dataObject).map(([key, value]) => [
      getFullKey(name, key),
      JSON.stringify(value),
    ]);
    await AsyncStorage.multiMerge(pairs);
  };

  const multiRemove = async (keys = []) => {
    const fullKeys = keys.map((key) => getFullKey(name, key));
    await AsyncStorage.multiRemove(fullKeys);
    return Promise.resolve(true);
  };

  const clear = async () => {
    const allKeys = await getAllKeys();
    await multiRemove(allKeys);
  };

  return {
    getAllKeys,
    getItem,
    setItem,
    mergeItem,
    removeItem,
    multiGet,
    multiSet,
    multiMerge,
    multiRemove,
    clear,
  };
};
