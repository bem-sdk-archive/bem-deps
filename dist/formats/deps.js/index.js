'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _reader = require('./reader');

var _reader2 = _interopRequireDefault(_reader);

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = { parser: _parser2.default, reader: _reader2.default };