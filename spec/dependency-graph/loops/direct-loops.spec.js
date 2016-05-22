'use strict';

const test = require('ava');

test('should not throw error if detected unordered direct loop', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'A' });

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }));
});

test('should not throw error if detected unordered direct loop with ordered part', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'A' }, { ordered: true });

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }));
});

test('should throw error if detected ordered direct loop', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' }, { ordered: true })
        .addDependency({ block: 'B' });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'A' }, { ordered: true });

    try {
        graph.dependenciesOf({ block: 'A' });
    } catch (error) {
        t.deepEqual(error.loop, [
            { entity: { block: 'A' } },
            { entity: { block: 'B' } },
            { entity: { block: 'A' } }
        ]);
    }
});
