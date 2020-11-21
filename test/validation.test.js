const PropTypes = require('prop-types');
const {
  validate,
  validateSchema,
  getMatchByRegexp,
  parseErrorMessages,
} = require('../src/validation');

describe('getMatchByRegexp', () => {
  const str = 'Test string contains Any_word and lorem ipsum';

  it('returns a match', () => {
    const regexp = /Any_word.*/g;

    expect(getMatchByRegexp(regexp, str)).toBe('Any_word and lorem ipsum');
  });

  it('returns null if there is no match', () => {
    const regexp = /blabla.*/g;

    expect(getMatchByRegexp(regexp, str)).toBe(null);
  });
});

describe('parseErrorMessages', () => {
  it('returns correct number of parsed messages', () => {
    const msgs = [
      'Some message contains Invalid: and some text here',
      'some message has Failed word and lorem',
      'Just a message',
    ];

    const parsedMsgs = parseErrorMessages(msgs);

    expect(parsedMsgs.length).toBe(msgs.length);
  });

  it('parses messages witch has "Invalid" word', () => {
    const msgs = [
      'Invalid something bla bla',
      'Message: Invalid data type',
      'Something happened Invalid string',
    ];
    expect(parseErrorMessages(msgs)).toMatchObject([
      'Invalid something bla bla',
      'Invalid data type',
      'Invalid string',
    ]);
  });

  it('parses messages witch has "Failed" word', () => {
    const msgs = [
      'Failed something bla bla',
      'Message: Failed data type',
      'Something happened Failed string',
    ];
    expect(parseErrorMessages(msgs)).toMatchObject([
      'Failed something bla bla',
      'Failed data type',
      'Failed string',
    ]);
  });
});

describe('validateSchema', () => {
  const invalidSchema = {
    name: PropTypes.string.isRequired,
    data: {
      isIt: PropTypes.bool.isRequired,
      value: PropTypes.number.isRequired,
    },
  };
  const validSchema = {
    name: PropTypes.string.isRequired,
    data: PropTypes.exact({
      isIt: PropTypes.bool.isRequired,
      value: PropTypes.number.isRequired,
    }),
  };

  it('throw an error if one of the schema properties is not instance of PropTypes', () => {
    expect(() => validateSchema('testStorage', invalidSchema)).toThrow('it must be a function');
  });

  it('does not throw an error if get a valid schema', () => {
    expect(() => validateSchema('testStorage', validSchema)).not.toThrow('it must be a function');
  });
});

describe('validate', () => {
  it('throw an error', () => {
    const schema = {
      number: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
    };
    const data = {
      number: 1,
      text: 2,
    };
    expect(() => validate('testStorage', schema, data)).toThrow('expected `string`');
  });

  it('does not throw an error', () => {
    const schema = {
      number: PropTypes.number.isRequired,
      text: PropTypes.string.isRequired,
    };
    const data = {
      number: 1,
      text: 'test text',
    };
    expect(() => validate('testStorage', schema, data)).not.toThrow('expected `string`');
  });
});
