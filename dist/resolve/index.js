'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

exports.default = function () {
    var declaration = arguments.length <= 0 || arguments[0] === undefined ? [] : arguments[0];
    var relations = arguments.length <= 1 || arguments[1] === undefined ? [] : arguments[1];
    var options = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

    if (!Array.isArray(relations)) {
        if ((0, _isRelation2.default)(relations)) {
            relations = [relations];
        } else if (arguments.length === 2) {
            options = relations;
            relations = [];
        }
    }

    if (typeof options === 'string') {
        options = { tech: options };
    }

    return (0, _resolve2.default)(declaration, relations, options);
};

var _resolve = require('./resolve');

var _resolve2 = _interopRequireDefault(_resolve);

var _isRelation = require('./is-relation');

var _isRelation2 = _interopRequireDefault(_isRelation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

;