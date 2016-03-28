import test from 'ava';

test('should not throw error if detected direct loop', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'A' }, { ordered: false });

    t.notThrows(() => {
        graph.dependenciesOf({ block: 'A' });
    });
});

test('should not throw error if detected ordered loop on itself', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'A' }, { ordered: true });

    t.notThrows(() => {
        graph.dependenciesOf({ block: 'A' });
    });
});
