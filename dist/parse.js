'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = parse;

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _parser = require('./formats/deps.js/parser');

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parse() {
    var parser = arguments.length <= 0 || arguments[0] === undefined ? _parser2.default : arguments[0];

    var transform = new _stream2.default.Transform({ objectMode: true });

    transform._transform = function (entityDeps, encoding, done) {
        this.push(parser(entityDeps));
        done();
    };

    return transform;
};