'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isRelation;

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function isRelation(obj) {
    return Boolean((typeof obj === 'undefined' ? 'undefined' : _typeof(obj)) === 'object' && !Array.isArray(obj) && obj.entity && obj.dependOn);
};