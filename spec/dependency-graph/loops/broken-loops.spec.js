'use strict';

const test = require('ava');

test('should not throw error if detected ordered loop broken in the middle by unordered dependency', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' }, { ordered: true });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'C' });

    graph
        .node({ block: 'C' })
        .addDependency({ block: 'A' }, { ordered: true });

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }));
});
