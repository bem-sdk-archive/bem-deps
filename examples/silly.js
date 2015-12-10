var path = require('path'),
    through2 = require('through2'),

    bemDeps = require('..'),
    depsJsFormat = require('../dist/formats/deps.js')['default'];

var declaration = [
        { block: 'a' }
    ],
    levels = [
         path.join(__dirname, 'blocks')
    ],
    tech = 'css',
    relations = [];

bemDeps.read({ levels: levels }, depsJsFormat.reader)
    .pipe(bemDeps.parse(depsJsFormat.parser))
    .pipe(through2.obj(
        function (relation, enc, callback) {
            relations.push(relation);
            callback();
        },
        function (callback) {
            var res = bemDeps.resolve(declaration, relations, { tech: tech });

            this.push(res);
            callback();
        }
    ))
    .pipe(through2.obj(function (result) {
        this.push(JSON.stringify(result, null, 4) + '\n');
    }))
    .pipe(process.stdout);
