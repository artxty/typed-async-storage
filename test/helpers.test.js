const { capitalize, getStorageFullName, getFullKey } = require('../src/helpers');

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
