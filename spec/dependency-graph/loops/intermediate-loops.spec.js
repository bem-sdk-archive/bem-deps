'use strict';

const test = require('ava');

const resolve = require('../../../lib').resolve;

test('should not throw error if detected unordered intermediate loop', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'C' });

    graph
        .node({ block: 'C' })
        .addDependency({ block: 'B' });

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }));
});

test('should not throw error if detected unordered intermediate loop with ordered part', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'C' });

    graph
        .node({ block: 'C' })
        .addDependency({ block: 'B' }, { ordered: true });

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }));
});

test('should throw error if detected ordered intermediate loop', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' }, { ordered: true });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'C' }, { ordered: true });

    graph
        .node({ block: 'C' })
        .addDependency({ block: 'B' }, { ordered: true });

    try {
        graph.dependenciesOf({ block: 'A' });
    } catch (error) {
        t.deepEqual(error.loop, [
            { entity: { block: 'B' } },
            { entity: { block: 'C' } },
            { entity: { block: 'B' } }
        ]);
    }
});
