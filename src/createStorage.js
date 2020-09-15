const { validate, validateSchema } = require('./validation');
const { capitalize } = require('./helpers');
const wrapAsyncStorage = require('./storage');

const createGetter = (storage, key) => {
  const capitalizedKey = capitalize(key);
  const getterName = `get${capitalizedKey}`;
  return {
    [getterName]: async () => storage.getItem(key),
  };
};

const createSetter = (storageName, storage, key, schemaSegment) => {
  const capitalizedKey = capitalize(key);
  const setterName = `set${capitalizedKey}`;
  const subSchema = { [key]: schemaSegment };

  return {
    [setterName]: async (data) => {
      validate(storageName, subSchema, { [key]: data });
      await storage.setItem(key, data);
    },
  };
};

const createMultiSetter = (storageName, storage, schema) => async (object) => {
  validate(storageName, { [storageName]: schema }, { [storageName]: object });
  await storage.multiSet(object);
};

const createMethods = (schema, storageName, storage) => {
  let methods = {};
  Object.keys(schema).forEach((key) => {
    methods = {
      ...methods,
      ...createSetter(storageName, storage, key, schema[key]),
      ...createGetter(storage, key),
    };
  });
  return methods;
};

const createMultipleMethods = (schema, storageName, storage) => {
  // multiRemove
  // multiMerge
  // getAllKeys

  const methods = {
    get: (keys = []) => storage.multiGet(keys),
    set: createMultiSetter(storageName, storage, schema),
  };

  return methods;
};

/* Add 'clear' function */
const createStorage = ({
  schema = {},
  name = '',
  AsyncStorage = null,
  multiple = false,
}) => {
  /* validation: check name(warning), check AsyncStorage(error) */
  validateSchema(schema);

  const storage = wrapAsyncStorage(name, AsyncStorage);

  if (multiple) {
    return createMultipleMethods(schema, name, storage);
  }
  return createMethods(schema, name, storage);
};

module.exports = {
  createStorage, createMethods, createGetter, createSetter,
};
