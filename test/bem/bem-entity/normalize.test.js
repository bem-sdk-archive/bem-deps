import test from 'ava';

import BemEntity from '../../../lib/bem/bem-entity';

test('should normalize boolean modifier of block', t => {
    const entity = new BemEntity({ block: 'block', modName: 'mod' });

    t.true(entity.modVal);
});

test('should normalize boolean modifier of elem', t => {
    const entity = new BemEntity({ block: 'block', elem: 'elem', modName: 'mod' });

    t.true(entity.modVal);
});
