const { checkPropTypes } = require('prop-types/prop-types');
const { getStorageFullName } = require('./helpers');

const getMatchByRegexp = (regexp, msg) => {
  const parsedMsg = regexp.exec(msg);
  return parsedMsg !== null ? parsedMsg[0] : null;
};

const parseErrorMessages = (messages = []) => {
  const parsedMsgs = [];
  messages.forEach((msg) => {
    const invalidMsg = getMatchByRegexp(/Invalid.*/g, msg);
    const failedMsg = getMatchByRegexp(/Failed.*/g, msg);

    if (invalidMsg !== null) {
      parsedMsgs.push(invalidMsg);
    } else if (failedMsg !== null) {
      parsedMsgs.push(failedMsg);
    } else {
      parsedMsgs.push(msg);
    }
  });
  return parsedMsgs;
};

/*
  Using this hack with console.error because of
  https://github.com/facebook/prop-types/issues/169
*/
const validate = (storageName, typeSpecs, values) => {
  const t = console.error;
  const messages = [];
  console.error = (msg) => messages.push(msg);
  checkPropTypes(typeSpecs, values, 'property', getStorageFullName(storageName));
  console.error = t;
  if (messages.length !== 0) {
    const errorMessages = parseErrorMessages(messages);
    if (errorMessages.length !== 0) {
      const errorMsg = errorMessages.join('\n');
      throw new TypeError(errorMsg);
    }
  }
};

const validateSchema = (schema) => {
  /* This scans only first level */
  const [storageName] = Object.keys(schema);
  Object.entries(schema[storageName]).forEach(([key, value]) => {
    if (typeof value !== 'function' || value.name !== 'bound checkType') { // 'bound checkType' is the name of PropTypes type function
      const msg = `Failed property type: ${getStorageFullName(storageName)}: property type '${key}' is invalid; it must be a function, usually from the \`prop-types\` package, but received '${typeof value}'.`;
      throw new TypeError(msg);
    }
  });
};

module.exports = {
  validate, validateSchema, parseErrorMessages, getMatchByRegexp,
};
