bem-deps
========

[![Build Status](http://img.shields.io/travis/bem-incubator/bem-deps/master.svg?style=flat&label=tests)](https://travis-ci.org/bem/bem-deps)
[![Build status](http://img.shields.io/appveyor/ci/blond/bem-deps.svg?style=flat&label=windows)](https://ci.appveyor.com/project/blond/bem-deps)
[![Coverage Status](https://img.shields.io/coveralls/bem-incubator/bem-deps.svg?branch=master&style=flat)](https://coveralls.io/r/bem-incubator/bem-deps)
[![Dependency Status](http://img.shields.io/david/bem-incubator/bem-deps.svg?style=flat)](https://david-dm.org/bem-incubator/bem-deps)

```js
var through2 = require('through2'),

    bemDeps = require('bem-deps'),
    depsJsFormat = require('bem-deps/dist/formats/deps.js');

var declaration = [{ block: 'a' }],
    levels = ['blocks'];

bemDeps.read({ levels: levels }, depsJsFormat.reader)
    .pipe(bemDeps.parse(depsJsFormat.parser))
    .pipe(bemDeps.resolve(declaration, { tech: 'css' }))
    .pipe(through2.obj(function (result) {
        this.push(JSON.stringify(result, null, 4) + '\n');
    }))
    .pipe(process.stdout);

// {
//     "entities": [
//         { "block": "c" },
//         { "block": "a" },
//         { "block": "b" }
//     ],
//     "dependOn": [
//         {
//             "tech": "bemhtml",
//             "entities": [
//                 { "block": "d" }
//             ]
//         }
//     ]
// }
```

License
-------

Code and documentation copyright 2015 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
