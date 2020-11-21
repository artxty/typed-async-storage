const AsyncStorage = require('@react-native-community/async-storage');
const PropTypes = require('prop-types');
const createStorage = require('../src/index');

const testSchema = {
  age: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
  isTrue: PropTypes.bool.isRequired,
};

jest.mock('@react-native-community/async-storage');

it('checks if Async Storage is used', async () => {
  await AsyncStorage.getItem('myKey');
  expect(AsyncStorage.getItem).toBeCalledWith('myKey');
});

describe('createStorage', () => {
  it('creates a storage without errors', () => {
    const storage = createStorage({ name: 'testStorage', schema: testSchema, AsyncStorage });
    expect(storage).toEqual(expect.any(Object));
  });
});
