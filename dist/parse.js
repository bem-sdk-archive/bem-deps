'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = parse;
var stream = require('stream');

function parse(cb) {
    var transform = new stream.Transform({ objectMode: true });

    transform._transform = function (entityDeps, encoding, done) {
        this.push(cb(entityDeps));
        done();
    };

    return transform;
};