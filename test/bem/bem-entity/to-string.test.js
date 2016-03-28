import test from 'ava';

import BemEntity from '../../../lib/bem/bem-entity';

test('should return id', t => {
    const entity = new BemEntity({ block: 'block' });

    t.is(entity.toString(), entity.id);
});
