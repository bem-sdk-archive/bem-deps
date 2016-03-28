import test from 'ava';

import BemEntity from '../../../lib/bem/bem-entity';

test('should build id for block', t => {
    const entity = new BemEntity({ block: 'block' });

    t.is(entity.id, 'block');
});

test('should build id for modifier of block', t => {
    const entity = new BemEntity({ block: 'block', modName: 'mod', modVal: 'val' });

    t.is(entity.id, 'block_mod_val');
});

test('should build id for boolean modifier of block', t => {
    const entity = new BemEntity({ block: 'block', modName: 'mod' });

    t.is(entity.id, 'block_mod');
});

test('should build id for element', t => {
    const entity = new BemEntity({ block: 'block', elem: 'elem' });

    t.is(entity.id, 'block__elem');
});

test('should build id for modifier of element', t => {
    const entity = new BemEntity({ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' });

    t.is(entity.id, 'block__elem_mod_val');
});

test('should build id for boolean modifier of element', t => {
    const entity = new BemEntity({ block: 'block', elem: 'elem', modName: 'mod' });

    t.is(entity.id, 'block__elem_mod');
});
