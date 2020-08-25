const AsyncStorage = require('@react-native-community/async-storage');
const PropTypes = require('prop-types/prop-types');
const {
  createStorage,
  createMethods,
  createSetter,
  createGetter,
} = require('../src/createStorage');
const { validate, validateSchema } = require('../src/validation');

jest.mock('../src/validation');
jest.mock('@react-native-community/async-storage');

const storageParam = {
  name: 'testStorage',
  instance: AsyncStorage,
};
const schema = {
  age: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

describe('createMethods', () => {
  const methods = createMethods(schema, storageParam);

  it('returns an object containing setters for each property of a schema', () => {
    expect(methods).toEqual(expect.objectContaining({
      setAge: expect.any(Function),
      setName: expect.any(Function),
    }));
  });

  it('returns an object containing getters for each property of a schema', () => {
    expect(methods).toEqual(expect.objectContaining({
      getAge: expect.any(Function),
      getName: expect.any(Function),
    }));
  });
});

describe('createSetter', () => {
  const key = 'dataKey';
  const setterObj = createSetter(storageParam, key, schema);

  it('returns an object with only one key - setter name', () => {
    const setterName = 'setDataKey';
    expect(Object.keys(setterObj)).toEqual([setterName]);
  });

  it('return an object with only one value - setter function', () => {
    expect(Object.values(setterObj)).toEqual([expect.any(Function)]);
  });

  describe('returned setter function', () => {
    const testData = 'some data';
    beforeAll(async () => {
      const [setter] = Object.values(setterObj);
      await setter(testData);
    });

    it('calls `validate` inside', () => {
      expect(validate).toHaveBeenCalled();
    });

    it('calls `setItem` of AsyncStorage inside', () => {
      expect(AsyncStorage.setItem).toBeCalledWith(key, testData);
    });
  });
});

describe('createGetter', () => {
  const key = 'dataKey';
  const getterObj = createGetter(storageParam, key, schema);

  it('returns an object with only one key - getter name', () => {
    const getterKey = 'getDataKey';
    expect(Object.keys(getterObj)).toEqual([getterKey]);
  });

  it('return an object with only one value - getter function', () => {
    expect(Object.values(getterObj)).toEqual([expect.any(Function)]);
  });

  describe('returned getter function', () => {
    const [getter] = Object.values(getterObj);

    it('calls `getItem` of AsyncStorage inside', async () => {
      await getter();
      expect(AsyncStorage.getItem).toBeCalledWith(key);
    });
  });
});

describe('createStorage', () => {
  const storage = createStorage('testStorage', schema, AsyncStorage);

  it('calls `validateSchema`', () => {
    expect(validateSchema).toBeCalledWith(schema);
  });

  it('returns result of `createMethods` function', () => {
    const methods = createMethods(schema, storage);
    expect(Object.keys(storage)).toEqual(Object.keys(methods));
  });
});
