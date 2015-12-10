'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = read;
var stream = require('stream'),
    naming = require('bem-naming'),
    walk = require('bem-walk');

// returns `output` stream which will flush each entity data (totalEntityFiles === 0)
// and ends when no more deps left (totalDepsFiles === 0)
function read(config, reader) {
    var output = new stream.Readable({ objectMode: true }),
        deps = {},
        isInited = false,
        totalDepsFiles = 0,
        walker = walk(config.levels, { defaults: config.options });

    walker.on('data', function (file) {
        if (file.tech !== 'deps.js') return;

        isInited = true;
        totalDepsFiles++;

        var name = naming.stringify(file.entity);

        deps[name] ? deps[name].files.push(file) : deps[name] = {
            files: [file],
            techs: {}
        };
    });

    walker.on('end', function () {
        Object.keys(deps).forEach(function (name) {
            var files = deps[name].files,
                totalEntityFiles = files.length;

            files.forEach(function (file) {
                reader(file, function (err, depsFile) {
                    if (err) {
                        output.emit('error', err);
                        output.push(null);
                        return;
                    }

                    totalDepsFiles--;
                    totalEntityFiles--;

                    depsFile.forEach(function (oneTechDeps) {
                        var techs = deps[name].techs,
                            techName = oneTechDeps.tech || '';

                        techs[techName] || (techs[techName] = []);
                        techs[techName].push([oneTechDeps]);
                    });

                    if (!totalEntityFiles) {
                        Object.keys(deps[name].techs).forEach(function (techName) {
                            output.push({
                                entity: file.entity,
                                tech: techName,
                                deps: deps[name].techs[techName]
                            });
                        });

                        output.push(null);
                    }
                });
            });
        });
    });

    output._read = function () {};

    return output;
};