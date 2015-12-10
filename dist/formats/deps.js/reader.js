'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = reader;
var fs = require('fs'),
    util = require('util'),
    depsNormalize = require('deps-normalize');

/**
 * Reads file and calls callback with normalized dependency object
 * @param {Object}
 */
function reader(file, cb) {
    fs.readFile(file.path, function (err, depsText) {
        if (err) return cb(err);

        var parsedDeps = eval(depsText.toString());

        Array.isArray(parsedDeps) || (parsedDeps = [parsedDeps]);

        cb(null, parsedDeps.map(function (dep) {
            ['mustDeps', 'shouldDeps', 'noDeps'].forEach(function (depsType) {
                dep[depsType] = depsNormalize(dep[depsType]);
            });

            // add entity info to dep item
            return util._extend(JSON.parse(JSON.stringify(file.entity)), dep);
        }));
    });
};