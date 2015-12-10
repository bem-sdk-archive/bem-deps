import path from 'path';
import {stringifyObject} from 'JSONStream';
import {read, parse, resolve} from '../lib';
import depsJsFormat from '../lib/formats/deps.js';

var declaration = [
    { block: 'a' }
];

var relations = [];

read({ levels: [
     path.join(__dirname, 'blocks')
]}, depsJsFormat.reader)
    .pipe(parse(depsJsFormat.parser))
    .on('data', function (data) {
        relations.push(data)
    })
    .on('end', function () {
        var res = resolve(declaration, relations, { tech: 'css' });
        console.log('%j', res);
    });
