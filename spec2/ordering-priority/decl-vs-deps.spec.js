import test from 'ava';

test('should prioritise ordered dependency over recommended decl ordering', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' }, { ordered: true });

    const entities = graph.dependenciesOf([{ block: 'A' }, { block: 'B' }]).entities;
    const indexA = entities.indexOf({ block: 'A' });
    const indexB = entities.indexOf({ block: 'B' });

    t.ok(indexB < indexA);
});

test('should prioritise recommended decl ordering over recommended deps ordering', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' })
        .addDependency({ block: 'C' });

    const entities = graph.dependenciesOf([{ block: 'A' }, { block: 'C' }, { block: 'B' }]).entities;
    const indexB = entities.indexOf({ block: 'B' });
    const indexC = entities.indexOf({ block: 'C' });

    t.ok(indexC < indexB);
});

test('should prioritise recommended decl ordering over unordered dependency', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' });

    const entities = graph.dependenciesOf([{ block: 'A' }, { block: 'B' }]).entities;
    const indexA = entities.indexOf({ block: 'A' });
    const indexB = entities.indexOf({ block: 'B' });

    t.ok(indexA < indexB);
});
