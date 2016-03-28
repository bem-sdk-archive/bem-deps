import test from 'ava';

test('should not throw error if detected unordered direct loop', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' }, { ordered: false });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'A' }, { ordered: false });

    t.notThrows(() => {
        graph.dependenciesOf({ block: 'A' });
    });
});

test('should not throw error if detected unordered direct loop wtesth ordered part', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' }, { ordered: false });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'A' }, { ordered: true });

    t.notThrows(() => {
        graph.dependenciesOf({ block: 'A' });
    });
});

test('should throw error if detected ordered direct loop', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' }, { ordered: true });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'A' }, { ordered: true });

    t.throws(() => {
        graph.dependenciesOf({ block: 'A' });
    });
});
