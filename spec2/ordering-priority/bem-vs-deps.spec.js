import test from 'ava';

test('should prioritise element over recommended deps ordering', t => {
    const graph = new DependencyGraph();
    const block = { block: 'B' };
    const element = { block: 'B', elem: 'e' };

    graph
        .node({ block: 'A' })
        .addDependency(element)
        .addDependency(block);

    const entities = graph.dependenciesOf({ block: 'A' }).entities;
    const blockIndex = entities.indexOf(block);
    const elementIndex = entities.indexOf(element);

    t.ok(blockIndex < elementIndex);
});

test('should prioritise boolean modifier of block over recommended decl ordering', t => {
    const graph = new DependencyGraph();
    const block = { block: 'B' };
    const modifier = { block: 'B', modName: 'm', modVal: true };

    graph
        .node({ block: 'A' })
        .addDependency(modifier)
        .addDependency(block);

    const entities = graph.dependenciesOf({ block: 'A' }).entities;
    const blockIndex = entities.indexOf(block);
    const modifierIndex = entities.indexOf(modifier);

    t.ok(blockIndex < modifierIndex);
});

test('should prioritise key-value modifier of block over recommended decl ordering', t => {
    const graph = new DependencyGraph();
    const block = { block: 'B' };
    const modifier = { block: 'B', modName: 'm', modVal: 'v' };

    graph
        .node({ block: 'A' })
        .addDependency(modifier)
        .addDependency(block);

    const entities = graph.dependenciesOf({ block: 'A' }).entities;
    const blockIndex = entities.indexOf(block);
    const modifierIndex = entities.indexOf(modifier);

    t.ok(blockIndex, modifierIndex);
});

test('should prioritise boolean modifier of element over recommended decl ordering', t => {
    const graph = new DependencyGraph();
    const element = { block: 'B', elem: 'e' };
    const modifier = { block: 'B', elem: 'e', modName: 'm', modVal: true };

    graph
        .node({ block: 'A' })
        .addDependency(modifier)
        .addDependency(element);

    const entities = graph.dependenciesOf({ block: 'A' }).entities;
    const elementIndex = entities.indexOf(element);
    const modifierIndex = entities.indexOf(modifier);

    t.ok(elementIndex < modifierIndex);
});

test('should prioritise key-value modifier of element over recommended decl ordering', t => {
    const graph = new DependencyGraph();
    const element = { block: 'B', elem: 'e' };
    const modifier = { block: 'B', elem: 'e', modName: 'm', modVal: 'v' };

    graph
        .node({ block: 'A' })
        .addDependency(modifier)
        .addDependency(element);

    const entities = graph.dependenciesOf({ block: 'A' }).entities;
    const elementIndex = entities.indexOf(element);
    const modifierIndex = entities.indexOf(modifier);

    t.ok(elementIndex, modifierIndex);
});

test('should prioritise block modifier natural ordering over recommended decl ordering', t => {
    const graph = new DependencyGraph();
    const booleanModifier = { block: 'B', modName: 'm', modVal: true };
    const keyValueModifier = { block: 'B', modName: 'm', modVal: 'v' };

    graph
        .node({ block: 'A' })
        .addDependency(keyValueModifier)
        .addDependency(booleanModifier);

    const entities = graph.dependenciesOf({ block: 'A' }).entities;
    const booleanModifierIndex = entities.indexOf(booleanModifier);
    const keyValueModifierIndex = entities.indexOf(keyValueModifier);

    t.ok(booleanModifierIndex, keyValueModifierIndex);
});

test('should prioritise element modifier natural ordering over recommended decl ordering', t => {
    const graph = new DependencyGraph();
    const booleanModifier = { block: 'B', modName: 'm', modVal: true };
    const keyValueModifier = { block: 'B', modName: 'm', modVal: 'v' };

    graph
        .node({ block: 'A' })
        .addDependency(keyValueModifier)
        .addDependency(booleanModifier);

    const entities = graph.dependenciesOf({ block: 'A' }).entities;
    const booleanModifierIndex = entities.indexOf(booleanModifier);
    const keyValueModifierIndex = entities.indexOf(keyValueModifier);

    t.ok(booleanModifierIndex, keyValueModifierIndex);
});
