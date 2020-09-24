const AsyncStorage = require('@react-native-community/async-storage');
const wrapAsyncStorage = require('../src/storage');
const { getFullKey } = require('../src/helpers');

const dummyData = {
  test1: [1, 2, 3],
  test2: {
    a: 1,
    b: '1',
  },
  test3: 'hello',
  test4: 42,
};

const dummyObject = {
  key1: {
    a: 1,
    b: true,
  },
  key2: {
    a: 2,
    b: false,
  },
};

describe('wrapAsyncStorage', () => {
  const storageName = 'testStorage';
  const wrappedAsyncStorage = wrapAsyncStorage(storageName, AsyncStorage);

  it('returns an object containing a list of functions (wrappers)', () => {
    const values = Object.values(wrappedAsyncStorage);

    expect(values.every((i) => typeof i === 'function')).toBeTruthy();
  });

  describe('setItem', () => {
    const { setItem } = wrappedAsyncStorage;
    it('calls original AsyncStorage.setItem with a fullKey and stringified data', async () => {
      const key = 'testKey';
      const fullKey = getFullKey(storageName, key);
      const stringifiedData = JSON.stringify(dummyData);

      await setItem(key, dummyData);

      expect(AsyncStorage.setItem).toBeCalledWith(fullKey, stringifiedData);
    });
  });

  describe('getItem', () => {
    const { getItem } = wrappedAsyncStorage;
    it('calls original AsyncStorage.getItem with a fullKey', async () => {
      const key = 'testKey';
      const fullKey = getFullKey(storageName, key);

      await getItem(key);

      expect(AsyncStorage.getItem).toBeCalledWith(fullKey);
    });

    it('returns parsed data', async () => {
      const key = 'testKey';

      const data = await getItem(key);

      expect(data).toEqual(dummyData);
    });
  });

  describe('mergeItem', () => {
    const { mergeItem } = wrappedAsyncStorage;

    it('calls original AsyncStorage.mergeItem with a fullKey and stringified data', async () => {
      const key = 'testKey';
      const data = { test1: [0, 0, 0] };
      const fullKey = getFullKey(storageName, key);

      await mergeItem(key, data);

      expect(AsyncStorage.mergeItem).toBeCalledWith(fullKey, JSON.stringify(data));
    });
  });

  describe('removeItem', () => {
    const { removeItem } = wrappedAsyncStorage;
    it('calls original AsyncStorage.removeItem with a fullKey', async () => {
      const key = 'testKey';
      const fullKey = getFullKey(storageName, key);

      await removeItem(key);

      expect(AsyncStorage.removeItem).toBeCalledWith(fullKey);
    });
  });

  describe('multiSet', () => {
    const { multiSet } = wrappedAsyncStorage;

    it('calls original AsyncStorage.multiSet with prepared pairs [fullKey, stringifiedValue] of data', async () => {
      await multiSet(dummyObject);
      expect(AsyncStorage.multiSet).toBeCalledWith(expect.any(Array));
    });
  });

  describe('multiGet', () => {
    const { multiGet } = wrappedAsyncStorage;
    const keys = ['key1', 'key2'];

    it('calls original AsyncStorage.multiGet with an array of fullKeys', async () => {
      await multiGet(keys);

      const fullKeys = keys.map((key) => getFullKey(storageName, key));
      expect(AsyncStorage.multiGet).toBeCalledWith(fullKeys);
    });

    it('returns parsed data', async () => {
      const data = await multiGet(keys);

      expect(data).toEqual(dummyObject);
    });
  });
});
