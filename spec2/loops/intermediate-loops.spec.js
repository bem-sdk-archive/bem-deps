import test from 'ava';

test('should not throw error if detected unordered intermediate loop', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' }, { ordered: false });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'C' }, { ordered: false });

    graph
        .node({ block: 'C' })
        .addDependency({ block: 'B' }, { ordered: false });

    t.notThrows(() => {
        graph.dependenciesOf({ block: 'A' });
    });
});

test('should not throw error if detected unordered intermediate loop with ordered part', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' }, { ordered: false });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'C' }, { ordered: false });

    graph
        .node({ block: 'C' })
        .addDependency({ block: 'B' }, { ordered: true });

    t.notThrows(() => {
        graph.dependenciesOf({ block: 'A' });
    });
});

test('should throw error if detected ordered intermediate loop', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' }, { ordered: false });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'C' }, { ordered: true });

    graph
        .node({ block: 'C' })
        .addDependency({ block: 'B' }, { ordered: true });

    t.throws(() => {
        graph.dependenciesOf({ block: 'A' });
    });
});
