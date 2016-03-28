import test from 'ava';

test('should prioritise ordered dependency over unordered dependency for the same entity', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' });
        .addDependency({ block: 'C' }, { ordered: true });

    const entities = graph.dependenciesOf({ block: 'A' }).entities;
    const indexB = entities.indexOf({ block: 'B' });
    const indexC = entities.indexOf({ block: 'C' });

    t.ok(indexC < indexB);
});

test('should prioritise ordered dependency over unordered dependency for different entities', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' }, { ordered: true });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'A' });

    const entities = graph.dependenciesOf({ block: 'A' }).entities;
    const indexA = entities.indexOf({ block: 'A' });
    const indexB = entities.indexOf({ block: 'B' });

    t.ok(indexB < indexA);
});
