module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
};

const {TextDecoder, TextEncoder} = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder