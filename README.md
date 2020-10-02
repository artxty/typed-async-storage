[![Build](https://img.shields.io/github/workflow/status/artxty/typed-async-storage/Node.js%20CI?style=flat-square)](https://github.com/artxty/typed-async-storage/actions?query=workflow%3A%22Node.js+CI%22)

# typed-async-storage

A tiny wrapper for [AsyncStorage](https://github.com/react-native-community/async-storage) that allows creating scheme-based storage and validation using [PropTypes](https://www.npmjs.com/package/prop-types)  

## Installation

```bash
npm install --save typed-async-storage
```

## Usage
Import the package along with *AsyncStorage* and *PropTypes*
```js
import createStorage from 'typed-async-storage';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
```

### Simple storage
To create a simple storage (single storage) use your old friend *PropTypes* to create a schema
```js
const simpleSchema = {
  greetingText: PropTypes.string.isRequired,
  darkMode: PropTypes.bool.isRequired,
};
```

Call *createStorage* and pass these required params: storage name, schema, and *AsyncStorage*
```js
const simpleStorage = createStorage({
  name: 'simpleStorage', // name must be unique for every storage
  schema: simpleSchema,
  AsyncStorage,
});
```

Now you can interact with your 'simpleStorage' and have *PropTypes* validation out of the box!
```js
await simpleStorage.set('darkMode', true);
const isDarkMode = await simpleStorage.get('darkMode');
console.log(isDarkMode); // prints 'true'

await simpleStorage.set('greetingText', 42);
// TypeError: Invalid property `greetingText` of type `number` supplied to `simpleStorage`, expected `string`.
```

### Multiple Storage
To deal with sets you have to wrap your schema in PropTypes.objectOf(), check next example.
```js
// Or you can use PropTypes.objectOf(PropTypes.shape({ ... }))
const usersSchema = PropTypes.objectOf(PropTypes.exact({
  name: PropTypes.string.isRequired,
  address: PropTypes.string.isRequired,
  birthDate: PropTypes.instanceOf(Date).isRequired,
}));

const usersStorage = createStorage({
  name: 'usersStorage',
  schema: usersSchema,
  AsyncStorage,
  isMultiple: true, // pass 'true' to a create multiple storage
});

await usersStorage.set({ // pass an object {key: data, ...} of items
  user1: {
    name: 'Bob',
    address: '42 12th Street',
    birthDate: new Date(2020, 1, 1),
  },
  user2: {
    name: 'Mike',
    address: '1 Main Street',
    birthDate: new Date(2019, 1, 1),
  },
});

// pass an array of keys you want to get
await usersStorage.get(['user1', 'user2']);

```

## Note
To make things simple, try to create storages that are as small as possible. For each group of items, create a new storage (users, settings, channels, etc.). Do **not** create a master storage that contains all the data of your application, it is **impossible** to deal with it using this package. Break it down into several smaller storages.

## API
API is built over [AsyncStorage API](https://react-native-community.github.io/async-storage/docs/api)
### Simple Storage
```js
// Sets value for a specific key
set('myKey1', { a: 1, b: 'text' })

// Gets value for a specific key
get('myKey1')

// Merges an existing value stored under 'key', with new 'value'
merge('myKey1', { b: 'test' }) // Check how it works: https://react-native-community.github.io/async-storage/docs/api#mergeitem

// Removes all data for myKey1
remove('myKey1')

// Returns all keys for a specific storage
getAllKeys()

// Removes all data for all keys in a specific storage
clear()
```
### Multiple Storage
```js
// Sets values for specific keys
set({
  key1: { a: 1, b: 'string' },
  key2: { a: 2, b: 'string1' },
})

// Gets values for specific keys
get(['key1', 'key2'])

// Multiple merging of existing and new values in a batch
merge({
  key1: { a: 5,},
  key2: { b: 'str' },
})

// Removes all data for key1 and key2
remove(['key1', 'key2'])

// Returns all keys for a specific storage
getAllKeys()

// Removes all data for all keys in a specific storage
clear()
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
