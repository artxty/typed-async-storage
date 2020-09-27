const AsyncStorage = require('@react-native-community/async-storage');
const PropTypes = require('prop-types/prop-types');
const {
  createStorage,
  createMethods,
  createMultiMethods,
} = require('../src/createStorage');

const wrapAsyncStorage = require('../src/storageWrapper');
const { validate, validateSchema } = require('../src/validation');

jest.mock('../src/storageWrapper', () => () => ({
  getAllKeys: jest.fn(),
  setItem: jest.fn(),
  getItem: jest.fn(),
  mergeItem: jest.fn(),
  removeItem: jest.fn(),
  multiSet: jest.fn(),
  multiGet: jest.fn(),
  multiMerge: jest.fn(),
  multiRemove: jest.fn(),
}));

jest.mock('@react-native-community/async-storage');

jest.mock('../src/validation');
afterEach(() => {
  validate.mockClear();
});

const storageName = 'testStorage';
const wrappedAsyncStorage = wrapAsyncStorage();

const schema = {
  age: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};

describe('createMethods', () => {
  const methods = createMethods(schema, storageName, wrappedAsyncStorage);

  it('return methods', () => {
    expect(methods).toEqual(expect.objectContaining({
      set: expect.any(Function),
      get: expect.any(Function),
    }));
  });

  describe('`getAllKeys` method', () => {
    it('calls `getAllKeys` inside wrappedAsyncStorage', async () => {
      await methods.getAllKeys();
      expect(wrappedAsyncStorage.getAllKeys).toHaveBeenCalled();
    });
  });

  describe('`set` method', () => {
    const data = 'Nick';
    beforeAll(async () => {
      await methods.set('name', data);
    });

    it('calls `validate` inside', () => {
      expect(validate).toHaveBeenCalled();
    });

    it('calls `setItem` of wrappedAsyncStorage inside', () => {
      expect(wrappedAsyncStorage.setItem).toBeCalledWith('name', data);
    });
  });

  describe('"get" method', () => {
    it('calls `getItem` of wrappedAsyncStorage inside', async () => {
      await methods.get('name');
      expect(wrappedAsyncStorage.getItem).toBeCalledWith('name');
    });
  });

  describe('"merge" method', () => {
    const data = 'Nick';
    beforeAll(async () => {
      await methods.merge('name', data);
    });

    it('calls `validate` inside', () => {
      expect(validate).toHaveBeenCalled();
    });

    it('calls `mergeItem` inside wrappedAsyncStorage', async () => {
      await methods.merge('name', data);
      expect(wrappedAsyncStorage.mergeItem).toBeCalledWith('name', data);
    });
  });

  describe('"remove" method', () => {
    it('calls `removeItem` inside wrappedAsyncStorage', async () => {
      await methods.remove('name');
      expect(wrappedAsyncStorage.removeItem).toBeCalledWith('name');
    });
  });
});

describe('createMultiMethods', () => {
  const multiSchema = PropTypes.objectOf(PropTypes.exact({
    a: PropTypes.number.isRequired,
    b: PropTypes.string,
  }));

  const multiMethods = createMultiMethods(multiSchema, 'testMultiStorage', wrappedAsyncStorage);
  const testData = { key: { a: 1 } };

  describe('get', () => {
    it('calls `multiGet` of wrappedAsyncStorage', async () => {
      await multiMethods.get('key');
      expect(wrappedAsyncStorage.multiGet).toBeCalledWith('key');
    });
  });

  describe('set', () => {
    beforeAll(async () => {
      await multiMethods.set(testData);
    });

    it('calls `validate`', () => {
      expect(validate).toHaveBeenCalled();
    });

    it('calls `multiSet` inside wrappedAsyncStorage', () => {
      expect(wrappedAsyncStorage.multiSet).toBeCalledWith(testData);
    });
  });

  describe('merge', () => {
    beforeAll(async () => {
      await multiMethods.merge(testData);
    });

    it('calls `validate` inside', () => {
      expect(validate).toHaveBeenCalled();
    });

    it('calls `multiMerge` inside wrappedAsyncStorage', async () => {
      await multiMethods.merge(testData);
      expect(wrappedAsyncStorage.multiMerge).toBeCalledWith(testData);
    });
  });

  describe('remove', () => {
    it('calls `multiRemove` inside wrappedAsyncStorage', async () => {
      await multiMethods.remove(['key1', 'key2']);
      expect(wrappedAsyncStorage.multiRemove).toBeCalledWith(['key1', 'key2']);
    });
  });
});

describe('createStorage', () => {
  const testStorage = createStorage({
    schema,
    name: storageName,
    AsyncStorage,
  });

  it('calls `validateSchema`', () => {
    expect(validateSchema).toHaveBeenCalled();
  });

  it('returns result of `createMethods` function', () => {
    const methods = createMethods(schema, testStorage);
    expect(Object.keys(testStorage)).toEqual(Object.keys(methods));
  });
});
