var bemDeps = require('..'),
    toArray = require('stream-to-array');

toArray(bemDeps.load({ levels: ['blocks'] }), function (err, relations) {
    var declaration = [{ block: 'a' }],
        res = bemDeps.resolve(declaration, relations, { tech: 'js' });

    console.log(JSON.stringify(res, null, 4));
});
