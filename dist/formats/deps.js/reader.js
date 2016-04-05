'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = reader;

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _normalize = require('./normalize');

var _normalize2 = _interopRequireDefault(_normalize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Reads file and calls callback with normalized dependency object
 * @param {Object}
 */
function reader(file, cb) {
    _fs2.default.readFile(file.path, function (err, depsText) {
        if (err) return cb(err);

        var parsedDeps = eval(depsText.toString());

        Array.isArray(parsedDeps) || (parsedDeps = [parsedDeps]);

        cb(null, parsedDeps.map(function (dep) {
            ['mustDeps', 'shouldDeps', 'noDeps'].forEach(function (depsType) {
                dep[depsType] = (0, _normalize2.default)(dep[depsType]);

                dep[depsType].forEach(function (entity) {
                    entity.block || (entity.block = file.entity.block);
                    entity.elem || (entity.elem = file.entity.elem);
                });
            });

            ['block', 'elem', 'modName', 'modVal'].forEach(function (field) {
                if (!dep[field] && file.entity[field]) dep[field] = file.entity[field];
            });

            return dep;
        }));
    });
};