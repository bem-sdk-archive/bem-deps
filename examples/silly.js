var through2 = require('through2'),

    bemDeps = require('..'),
    depsJsFormat = require('../dist/formats/deps.js');

var declaration = [{ block: 'a' }],
    levels = ['blocks'];

bemDeps.read({ levels: levels }, depsJsFormat.reader)
    .pipe(bemDeps.parse(depsJsFormat.parser))
    .pipe(bemDeps.resolve(declaration, { tech: 'js' }))
    .pipe(through2.obj(function (result) {
        this.push(JSON.stringify(result, null, 4) + '\n');
    }))
    .pipe(process.stdout);
