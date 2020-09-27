const { validate, validateSchema, validateKey } = require('./validation');
const wrapAsyncStorage = require('./storageWrapper');

const createMethods = (schema, storageName, storage) => ({
  get: async (key) => {
    validateKey(schema, key);
    return storage.getItem(key);
  },
  set: async (key, data) => {
    validateKey(schema, key);
    validate(storageName, { [key]: schema[key] }, { [key]: data });
    return storage.setItem(key, data);
  },
  merge: async (key, data) => {
    validateKey(schema, key);
    validate(storageName, { [key]: schema[key] }, { [key]: data });
    return storage.mergeItem(key, data);
  },
  remove: async (key) => {
    validateKey(schema, key);
    return storage.removeItem(key);
  },
  getAllKeys: async () => storage.getAllKeys(),
  clear: async () => storage.clear(),
});

const createMultiMethods = (schema, storageName, storage) => ({
  get: async (keys) => storage.multiGet(keys),
  set: async (object) => {
    validate(storageName, { [storageName]: schema }, { [storageName]: object });
    await storage.multiSet(object);
  },
  merge: async (object) => {
    validate(storageName, { [storageName]: schema }, { [storageName]: object });
    await storage.multiMerge(object);
  },
  remove: async (keys) => storage.multiRemove(keys),
  getAllKeys: async () => storage.getAllKeys(),
  clear: async () => storage.clear(),
});

const createStorage = ({
  schema,
  name,
  AsyncStorage,
  isMultiple = false,
}) => {
  if (!schema) throw new Error('schema is required');
  if (!name) throw new Error('name is required');
  if (!AsyncStorage) throw new Error('AsyncStorage is required');

  validateSchema(name, schema, isMultiple);

  const storage = wrapAsyncStorage(name, AsyncStorage);

  if (isMultiple) {
    return createMultiMethods(schema, name, storage);
  }
  return createMethods(schema, name, storage);
};

module.exports = {
  createStorage,
  createMethods,
  createMultiMethods,
};
