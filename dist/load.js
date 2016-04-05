'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (config) {
    var format = arguments.length <= 1 || arguments[1] === undefined ? _deps2.default : arguments[1];

    return (0, _read2.default)(config, format.reader).pipe((0, _parse2.default)(format.parser));
};

var _read = require('./read');

var _read2 = _interopRequireDefault(_read);

var _parse = require('./parse');

var _parse2 = _interopRequireDefault(_parse);

var _deps = require('./formats/deps.js');

var _deps2 = _interopRequireDefault(_deps);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;