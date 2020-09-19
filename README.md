[![Build](https://img.shields.io/github/workflow/status/artxty/typed-async-storage/Node.js%20CI?style=flat-square)](https://github.com/artxty/typed-async-storage/actions?query=workflow%3A%22Node.js+CI%22)

# typed-async-storage

A tiny wrapper for [AsyncStorage](https://github.com/react-native-community/async-storage) that allows creating schema-based storage and validation using [PropTypes](https://www.npmjs.com/package/prop-types) 

## Installation

```bash
npm install --save typed-async-storage
```

## Usage
Import the package and *AsyncStorage* and *PropTypes* as well
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

Now you have dynamically created setters and getters to interact with your 'simpleStorage' and *PropTypes* validation out of the box!
```js
await simpleStorage.setDarkMode(true);
const isDarkMode = await simpleStorage.getDarkMode();
console.log(isDarkMode); // prints 'true'

await simpleStorage.setGreetingText(42);
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
To make things simple, try to create storages as small as possible. For each group of items create a new storage (users, settings, channels, etc.). Do **not** create a master storage that contains all the data of your application, it is **impossible** to deal with it using this package. Break it down into several small storages.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
