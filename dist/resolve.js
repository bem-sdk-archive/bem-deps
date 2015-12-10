'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function (_ref) {
    var declaration = _ref.declaration;
    var options = _ref.options;

    var flusher = new _stream2.default.Transform({ objectMode: true }),
        relations = [];

    flusher._transform = function (chunk, encoding, done) {
        console.log(111, chunk);
        this.push(chunk);
        done();
    };

    // flusher._flush = function (done) {
    //     console.log(declaration, relations, options);
    //     var res = resolve(declaration, relations, options);
    //
    //     this.write(res, done);
    // };

    return flusher;
};

var _stream = require('stream');

var _stream2 = _interopRequireDefault(_stream);

var _resolve = require('./resolve');

var _resolve2 = _interopRequireDefault(_resolve);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;