const {
  getStorageFullName,
  getShortKey,
  capitalize,
  getFullKey,
} = require('../src/helpers');

test('capitalize', () => {
  const string = 'hello world';
  const capitalizedString = 'Hello world';
  expect(capitalize(string)).toBe(capitalizedString);
});

test('getStorageFullName', () => {
  const rawStorageName = 'settings';
  expect(getStorageFullName(rawStorageName)).toBe('settingsStorage');
});

test('getFullKey', () => {
  const storageName = 'settingsStorage';
  const key = 'sound';
  expect(getFullKey(storageName, key)).toBe('@settingsStorage-sound');
});

test('getShortKey', () => {
  const storageName = 'chanelStorage';
  const key = '@a-ch1-h2_k1@st-1';
  const fullKey = getFullKey(storageName, key);
  expect(getShortKey(storageName, fullKey)).toBe(key);
});
