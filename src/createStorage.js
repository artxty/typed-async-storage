const { validate, validateSchema } = require('./validation');
const wrapAsyncStorage = require('./storage');

const checkKey = (schema, key) => {
  const schemaKeys = Object.keys(schema);
  if (!schemaKeys.includes(key)) {
    throw new Error(`Invalid key (${key}). Valid keys: [${schemaKeys}]`);
  }
};

const createMethods = (schema, storageName, storage) => ({
  get: async (key) => {
    checkKey(schema, key);
    return storage.getItem(key);
  },
  set: async (key, data) => {
    checkKey(schema, key);
    validate(storageName, { [key]: schema[key] }, { [key]: data });
    return storage.setItem(key, data);
  },
  merge: async (key, data) => {
    checkKey(schema, key);
    validate(storageName, { [key]: schema[key] }, { [key]: data });
    return storage.mergeItem(key, data);
  },
  remove: async (key) => {
    checkKey(schema, key);
    return storage.removeItem(key);
  },
  getAllKeys: async () => storage.getAllKeys(),
});

const createMultiSetter = (storageName, storage, schema) => async (object) => {
  validate(storageName, { [storageName]: schema }, { [storageName]: object });
  await storage.multiSet(object);
};

const createMultiGetter = (storage) => (keys = []) => storage.multiGet(keys);

const createMultiMethods = (schema, storageName, storage) => {
  const methods = {
    get: createMultiGetter(storage),
    set: createMultiSetter(storageName, storage, schema),
    merge: async (object) => {
      validate(storageName, { [storageName]: schema }, { [storageName]: object });
      await storage.multiMerge(object);
    },
    getAllKeys: async () => storage.getAllKeys(),
  };

  return methods;
};

/* Add 'clear' function */
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
  createMultiSetter,
  createMultiGetter,
  createMultiMethods,
};
