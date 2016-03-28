import test from 'ava';

test('should throw error if detected ordered loop between same techs', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' }, { tech: 'css' })
        .addDependency({ block: 'B' }, { tech: 'css', ordered: true });

    graph
        .node({ block: 'B' }, { tech: 'css' })
        .addDependency({ block: 'A' }, { tech: 'css', ordered: true });

    t.throws(() => {
        graph.dependenciesOf({ block: 'A' }, { tech: 'css' });
    });
});

test('should not throw error if detected loop between different techs', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' }, { tech: 'js' })
        .addDependency({ block: 'B' }, { tech: 'bemhtml' });

    graph
        .node({ block: 'B' }, { tech: 'js' })
        .addDependency({ block: 'A' }, { tech: 'bemhtml' });

    t.notThrows(() => {
        graph.dependenciesOf({ block: 'A' }, { tech: 'js' });
    });
});

test('should not throw error if detected loop between common and specific techs', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'A' }, { tech: 'css' });

    t.notThrows(() => {
        graph.dependenciesOf({ block: 'A' }, { tech: 'css' });
    });
});
