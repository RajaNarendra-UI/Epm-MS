// const { expect, jest } = require('@jest/globals')

require('@testing-library/jest-dom');

// const { TestEncoder , TestDecoder } = require('util');

// global.expect = expect;
// global.jest = jest;

global.TextEncoder = require('util').TestEncoder;
global.TextDecoder = require('util').TestDecoder;