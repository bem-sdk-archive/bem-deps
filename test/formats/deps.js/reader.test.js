'use strict';

const test = require('ava');
const mockfs = require('mock-fs');
const reader = require('../../../lib/formats/deps.js/reader');

test.before(() => {
    mockfs({
        'some.deps.js': '({ shouldDeps: "block" });'
    });
});

test.after(() => {
    mockfs.restore();
});

test('should read', t => {
    t.plan(1);
    return reader({ path: 'some.deps.js' }).then(res => {
        t.truthy(res.data.shouldDeps);
    });
});
