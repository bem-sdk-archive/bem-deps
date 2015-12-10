bem-deps
========

[![Build Status](http://img.shields.io/travis/bem-incubator/bem-deps/master.svg?style=flat&label=tests)](https://travis-ci.org/bem/bem-deps)
[![Build status](http://img.shields.io/appveyor/ci/blond/bem-deps.svg?style=flat&label=windows)](https://ci.appveyor.com/project/blond/bem-deps)
[![Coverage Status](https://img.shields.io/coveralls/bem-incubator/bem-deps.svg?branch=master&style=flat)](https://coveralls.io/r/bem-incubator/bem-deps)
[![Dependency Status](http://img.shields.io/david/bem-incubator/bem-deps.svg?style=flat)](https://david-dm.org/bem-incubator/bem-deps)

```js
import { stringifyObject } from 'JSONStream';

import { read, parse, resolve } from 'bem-deps';
import depsJsFormat from 'bem-deps/lib/formats/deps.js';

var declaration = [
    { block: 'a' }
];

read({ levels: ['blocks'], depsJsFormat.reader })
    .pipe(parse(depsJsFormat.parser))
    .pipe(resolve({ declaration: declaration, options: { tech: 'css' } }))
    .pipe(stringifyObject())
    .pipe(process.stdout);
```

License
-------

Code and documentation copyright 2015 YANDEX LLC. Code released under the [Mozilla Public License 2.0](LICENSE.txt).
