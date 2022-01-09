module.exports = {
  preset: "ts-jest",
  transform: {
    "^.+\\.(ts|tsx)?$": "ts-jest",
    "^.+\\.(js|jsx)$": "babel-jest",
  },
  testRunner: "jest-jasmine2"
};


const {TextDecoder, TextEncoder} = require('util')
global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder