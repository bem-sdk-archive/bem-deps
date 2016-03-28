import test from 'ava';

test('should prioritise ordered dependency over element', t => {
    const graph = new DependencyGraph();
    const block = { block: 'A' };
    const element = { block: 'A', elem: 'e' };

    graph
        .node(block)
        .addDependency(element, { ordered: true });

    const entities = graph.dependenciesOf([block, element]).entities;
    const blockIndex = entities.indexOf(block);
    const elementIndex = entities.indexOf(element);

    t.ok(elementIndex < blockIndex);
});

test('should prioritise ordered dependency over boolean modifier of block', t => {
    const graph = new DependencyGraph();
    const block = { block: 'A' };
    const modifier = { block: 'A', modName: 'm', modVal: true };

    graph
        .node(block)
        .addDependency(modifier, { ordered: true });

    const entities = graph.dependenciesOf([block, modifier]).entities;
    const blockIndex = entities.indexOf(block);
    const modifierIndex = entities.indexOf(modifier);

    t.ok(modifierIndex < blockIndex);
});

test('should prioritise ordered dependency over key-value modifier of block', t => {
    const graph = new DependencyGraph();
    const block = { block: 'A' };
    const modifier = { block: 'A', modName: 'm', modVal: 'v' };

    graph
        .node(block)
        .addDependency(modifier, { ordered: true });

    const entities = graph.dependenciesOf([block, modifier]).entities;
    const blockIndex = entities.indexOf(block);
    const modifierIndex = entities.indexOf(modifier);

    t.ok(modifierIndex < blockIndex);
});

test('should prioritise ordered dependency over boolean modifier of element', t => {
    const graph = new DependencyGraph();
    const element = { block: 'A', elem: 'e' };
    const modifier = { block: 'A', elem: 'e', modName: 'm', modVal: true };

    graph
        .node(block)
        .addDependency(modifier, { ordered: true });

    const entities = graph.dependenciesOf([element, modifier]).entities;
    const elementIndex = entities.indexOf(element);
    const modifierIndex = entities.indexOf(modifier);

    t.ok(modifierIndex < elementIndex);
});

test('should prioritise ordered dependency over key-value modifier of element', t => {
    const graph = new DependencyGraph();
    const element = { block: 'A', elem: 'e' };
    const modifier = { block: 'A', elem: 'e', modName: 'm', modVal: 'v' };

    graph
        .node(block)
        .addDependency(modifier, { ordered: true });

    const entities = graph.dependenciesOf([element, modifier]).entities;
    const elementIndex = entities.indexOf(element);
    const modifierIndex = entities.indexOf(modifier);

    t.ok(modifierIndex < elementIndex);
});

test('should prioritise ordered dependency over block modifier natural ordering', t => {
    const graph = new DependencyGraph();
    const booleanModifier = { block: 'A', modName: 'm', modVal: true };
    const keyValueModifier = { block: 'A', modName: 'm', modVal: 'v' };

    graph
        .node(booleanModifier)
        .addDependency(keyValueModifier, { ordered: true });

    const entities = graph.dependenciesOf([booleanModifier, keyValueModifier]).entities;
    const booleanModifierIndex = entities.indexOf(booleanModifier);
    const keyValueModifierIndex = entities.indexOf(keyValueModifier);

    t.ok(keyValueModifierIndex < booleanModifierIndex);
});

test('should prioritise ordered dependency over element modifier natural ordering', t => {
    const graph = new DependencyGraph();
    const booleanModifier = { block: 'A', modName: 'm', modVal: true };
    const keyValueModifier = { block: 'A', modName: 'm', modVal: 'v' };

    graph
        .node(booleanModifier)
        .addDependency(keyValueModifier, { ordered: true });

    const entities = graph.dependenciesOf([booleanModifier, keyValueModifier]).entities;
    const booleanModifierIndex = entities.indexOf(booleanModifier);
    const keyValueModifierIndex = entities.indexOf(keyValueModifier);

    t.ok(keyValueModifierIndex < booleanModifierIndex);
});
