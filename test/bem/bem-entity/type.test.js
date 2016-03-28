import test from 'ava';

import BemEntity from '../../../lib/bem/bem-entity';

test('should get type for block', t => {
    const entity = new BemEntity({ block: 'block' });

    t.is(entity.type, 'block');
});

test('should get type for modifier of block', t => {
    const entity = new BemEntity({ block: 'block', modName: 'mod' });

    t.is(entity.type, 'blockMod');
});

test('should get type for element', t => {
    const entity = new BemEntity({ block: 'block', elem: 'elem' });

    t.is(entity.type, 'elem');
});

test('should get type for modifier of element', t => {
    const entity = new BemEntity({ block: 'block', elem: 'elem', modName: 'mod' });

    t.is(entity.type, 'elemMod');
});
