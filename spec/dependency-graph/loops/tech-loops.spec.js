'use strict';

const test = require('ava');

const resolve = require('../../../lib').resolve;

test('should throw error if detected ordered loop between same techs', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' }, { tech: 'css' })
        .addDependency({ block: 'B' }, { tech: 'css', ordered: true });

    graph
        .node({ block: 'B' }, { tech: 'css' })
        .addDependency({ block: 'A' }, { tech: 'css', ordered: true });

    try {
        graph.dependenciesOf({ block: 'A' }, { tech: 'css' });
    } catch (error) {
        t.deepEqual(error.loop, [
            { entity: { block: 'A' } },
            { entity: { block: 'B' } },
            { entity: { block: 'A' } }
        ]);
    }
});

test('should not throw error if detected loop between different techs', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' }, { tech: 'js' })
        .addDependency({ block: 'B' }, { tech: 'bemhtml', ordered: true });

    graph
        .node({ block: 'B' }, { tech: 'js' })
        .addDependency({ block: 'A' }, { tech: 'bemhtml', ordered: true });

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }, { tech: 'js' }));
});

test('should throw error if detected loop between common and specific techs', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' }, { ordered: true });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'A' }, { tech: 'css', ordered: true });

    try {
        graph.dependenciesOf({ block: 'A' })
    } catch (error) {
        t.deepEqual(error.loop, [
            { entity: { block: 'A' } },
            { entity: { block: 'B' } },
            { entity: { block: 'A' } }
        ]);
    }
});

test('should throw error if detected loop between common and other techs', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'B' });

    graph
        .node({ block: 'B' })
        .addDependency({ block: 'A' }, { tech: 'css');

    try {
        graph.dependenciesOf({ block: 'A' }, { tech: 'css' })
    } catch (error) {
        t.deepEqual(error.loop, [
            { entity: { block: 'A' } },
            { entity: { block: 'B' } },
            { entity: { block: 'A' } }
        ]);
    }
});

test('should not throw error if detected loop on itself with other tech', t => {
    const graph = new DependencyGraph();

    graph
        .node({ block: 'A' }, { tech: 'css' })
        .addDependency({ block: 'A' }, { tech: 'js', ordered: true });

    graph
        .node({ block: 'A' })
        .addDependency({ block: 'A' }, { tech: 'css');

    t.notThrows(() => graph.dependenciesOf({ block: 'A' }, { tech: 'css' }));
});
