[![Build](https://img.shields.io/github/workflow/status/artxty/typed-async-storage/Node.js%20CI?style=flat-square)](https://github.com/artxty/typed-async-storage/actions?query=workflow%3A%22Node.js+CI%22)

# typed-async-storage

A tiny library-wrapper for [AsyncStorage](https://github.com/react-native-community/async-storage) that allows you to create schema-based storage using [PropTypes](https://www.npmjs.com/package/prop-types)

## Installation

```bash
npm install --save typed-async-storage
```

## Usage
Import the package
```js
import createStorage from 'typed-async-storage';
```

Import *AsyncStorage* and *PropTypes* as well
```js
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';
```

Use your old friend *PropTypes* to create a schema
```js
const schema = {
  greetingText: PropTypes.string.isRequired,
  darkMode: PropTypes.bool.isRequired,
};
```

Pass to *createStorage* three params: storage name, schema, and *AsyncStorage*
```js
const storageName = 'myStorage';
const myStorage = createStorage(storageName, schema, AsyncStorage);
```

Now you have dynamically created setters and getters to interact with the storage
```js
await myStorage.setGreetingText('Hello word');
await myStorage.setDarkMode(true);

const text = await myStorage.getGreetingText();
console.log(text); // prints 'Hello word'

const isDarkMode = await myStorage.getDarkMode();
console.log(isDarkMode); // prints 'true'
```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
