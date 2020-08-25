const { validate, validateSchema } = require('./validation');
const { capitalize } = require('./helpers');
const createAsyncStorage = require('./storage');

const createGetter = (storage, key) => {
  const capitalizedKey = capitalize(key);
  const getterName = `get${capitalizedKey}`;
  return {
    [getterName]: async () => storage.instance.getItem(key),
  };
};

const createSetter = (storage, key, schemaSegment) => {
  const capitalizedKey = capitalize(key);
  const setterName = `set${capitalizedKey}`;
  const subSchema = { [key]: schemaSegment };

  return {
    [setterName]: async (data) => {
      validate(storage.name, subSchema, { [key]: data });
      await storage.instance.setItem(key, data);
    },
  };
};

const createMethods = (schema, storage) => {
  let methods = {};
  Object.keys(schema).forEach((key) => {
    methods = {
      ...methods,
      ...createSetter(storage, key, schema[key]),
      ...createGetter(storage, key),
    };
  });
  return methods;
};

const createStorage = (name, schema = {}, storageInstance) => {
  validateSchema(schema);
  const storage = {
    name,
    instance: createAsyncStorage(name, storageInstance),
  };
  return createMethods(schema, storage);
};

module.exports = {
  createStorage, createMethods, createGetter, createSetter,
};
