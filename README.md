bem-deps
========

[![Build Status](http://img.shields.io/travis/bem-incubator/bem-deps/master.svg?style=flat&label=tests)](https://travis-ci.org/bem/bem-deps)
[![Build status](http://img.shields.io/appveyor/ci/blond/bem-deps.svg?style=flat&label=windows)](https://ci.appveyor.com/project/blond/bem-deps)
[![Coverage Status](https://img.shields.io/coveralls/bem-incubator/bem-deps.svg?branch=master&style=flat)](https://coveralls.io/r/bem-incubator/bem-deps)
[![Dependency Status](http://img.shields.io/david/bem-incubator/bem-deps.svg?style=flat)](https://david-dm.org/bem-incubator/bem-deps)

```js
var path = require('path'),
    require('JSONStream').stringifyObject,
    bemDeps = require('../dist'),
    read = bemDeps.read,
    parse = bemDeps.parse,
    resolve = bemDeps.resolve;

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
```

License
-------

Code and documentation copyright 2015 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
