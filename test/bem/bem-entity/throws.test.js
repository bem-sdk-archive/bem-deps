import test from 'ava';

import BemEntity from '../../../lib/bem/bem-entity';

test('should throw error for if entity object is not valid', t => {
    t.throws(
        () => { new BemEntity({ elem: 'elem' }); },
        'This is not valid BEM entity: the field `block` is undefined.'
    );
});
