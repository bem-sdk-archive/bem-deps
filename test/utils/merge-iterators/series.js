import iterators from '../../../lib/utils/iterators';
import { expect } from 'chai';

describe('`merge-iterators`.series()', function () {
    it('should 1', function () {
        expect(series()).to.be.empty;
    });

    it('should support', function () {
        var set = new Set([1, 2, 3]);
        var iter = iterators.series(set);

        expect(Array.from(iter)).to.be.deep.equal([1, 2, 3]);
    });

    it('should 2', function () {
        expect(series([1, 2, 3])).to.be.deep.equal([1, 2, 3]);
    });

    it('should 3', function () {
        expect(series([1, 2], [3, 4])).to.be.deep.equal([1, 2, 3, 4]);
    });

    it('should 4', function () {
        expect(series([1], [], [3])).to.be.deep.equal([1, 3]);
    });
});

function series(...arrs) {
    var iters = arrs.map(arr => arr[Symbol.iterator]()),
        iter = iterators.series(...iters);

    return Array.from(iter);
}
