import test from 'ava';

import BemEntity from '../../../lib/bem/bem-entity';

test('should provide `block` field', t => {
    const entity = new BemEntity({ block: 'block' });

    t.is(entity.block, 'block');
});

test('should provide `elem` field', t => {
    const entity = new BemEntity({ block: 'block', elem: 'elem' });

    t.is(entity.elem, 'elem');
});

test('should provide `modName` field', t => {
    const entity = new BemEntity({ block: 'block', modName: 'mod' });

    t.is(entity.modName, 'mod');
});

test('should provide `modVal` field', t => {
    const entity = new BemEntity({ block: 'block', modName: 'mod', modVal: 'val' });

    t.is(entity.modVal, 'val');
});
