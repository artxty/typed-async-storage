const AsyncStorage = require('@react-native-community/async-storage');
const createAsyncStorage = require('../src/storage');
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

describe('createAsyncStorage', () => {
  const storageName = 'testStorage';
  const asyncStorage = createAsyncStorage(storageName, AsyncStorage);

  it('returns an object containing a list of functions (wrappers)', () => {
    const values = Object.values(asyncStorage);

    expect(values.every((i) => typeof i === 'function')).toBeTruthy();
  });

  describe('setItem', () => {
    const { setItem } = asyncStorage;
    it('calls original AsyncStorage.setItem with a fullKey and stringified data', async () => {
      const key = 'testKey';
      const fullKey = getFullKey(storageName, key);
      const stringifiedData = JSON.stringify(dummyData);

      await setItem(key, dummyData);

      expect(AsyncStorage.setItem).toBeCalledWith(fullKey, stringifiedData);
    });
  });

  describe('getItem', () => {
    const { getItem } = asyncStorage;
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
});
