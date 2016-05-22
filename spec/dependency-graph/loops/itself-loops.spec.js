'use strict';

const test = require('ava');

const resolve = require('../../../lib').resolve;

test('should not throw error if detected unordered loop on itself', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'A' });

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }));
});

test('should not throw error if detected ordered loop on itself', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'A' }, { ordered: true });

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }));
});
