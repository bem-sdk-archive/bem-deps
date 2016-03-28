import test from 'ava';

test('should prioritise element over recommended decl ordering', t => {
    const graph = new DependencyGraph();
    const block = { block: 'A' };
    const element = { block: 'A', elem: 'e' };

    const entities = graph.dependenciesOf([element, block]).entities;
    const blockIndex = entities.indexOf(block);
    const elementIndex = entities.indexOf(element);

    t.ok(blockIndex < elementIndex);
});

test('should prioritise boolean modifier of block over recommended decl ordering', t => {
    const graph = new DependencyGraph();
    const block = { block: 'A' };
    const modifier = { block: 'A', modName: 'm', modVal: true };

    const entities = graph.dependenciesOf([modifier, block]).entities;
    const blockIndex = entities.indexOf(block);
    const modifierIndex = entities.indexOf(modifier);

    t.ok(blockIndex < modifierIndex);
});

test('should prioritise key-value modifier of block over recommended decl ordering', t => {
    const graph = new DependencyGraph();
    const block = { block: 'A' };
    const modifier = { block: 'A', modName: 'm', modVal: 'v' };

    const entities = graph.dependenciesOf([modifier, block]).entities;
    const blockIndex = entities.indexOf(block);
    const modifierIndex = entities.indexOf(modifier);

    t.ok(blockIndex, modifierIndex);
});

test('should prioritise boolean modifier of element over recommended decl ordering', t => {
    const graph = new DependencyGraph();
    const element = { block: 'A', elem: 'e' };
    const modifier = { block: 'A', elem: 'e', modName: 'm', modVal: true };

    const entities = graph.dependenciesOf([modifier, element]).entities;
    const elementIndex = entities.indexOf(element);
    const modifierIndex = entities.indexOf(modifier);

    t.ok(elementIndex < modifierIndex);
});

test('should prioritise key-value modifier of element over recommended decl ordering', t => {
    const graph = new DependencyGraph();
    const element = { block: 'A', elem: 'e' };
    const modifier = { block: 'A', elem: 'e', modName: 'm', modVal: 'v' };

    const entities = graph.dependenciesOf([modifier, element]).entities;
    const elementIndex = entities.indexOf(element);
    const modifierIndex = entities.indexOf(modifier);

    t.ok(elementIndex, modifierIndex);
});

test('should prioritise block modifier natural ordering over recommended decl ordering', t => {
    const graph = new DependencyGraph();
    const booleanModifier = { block: 'A', modName: 'm', modVal: true };
    const keyValueModifier = { block: 'A', modName: 'm', modVal: 'v' };

    const entities = graph.dependenciesOf([keyValueModifier, booleanModifier]).entities;
    const booleanModifierIndex = entities.indexOf(booleanModifier);
    const keyValueModifierIndex = entities.indexOf(keyValueModifier);

    t.ok(booleanModifierIndex, keyValueModifierIndex);
});

test('should prioritise element modifier natural ordering over recommended decl ordering', t => {
    const graph = new DependencyGraph();
    const booleanModifier = { block: 'A', modName: 'm', modVal: true };
    const keyValueModifier = { block: 'A', modName: 'm', modVal: 'v' };

    const entities = graph.dependenciesOf([keyValueModifier, booleanModifier]).entities;
    const booleanModifierIndex = entities.indexOf(booleanModifier);
    const keyValueModifierIndex = entities.indexOf(keyValueModifier);

    t.ok(booleanModifierIndex, keyValueModifierIndex);
});
