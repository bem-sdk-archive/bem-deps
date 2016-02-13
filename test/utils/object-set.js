import createSet from '../../lib/utils/object-set';
import { expect } from 'chai';

describe('`object-set`', function() {
    var JSONSet = createSet(JSON.stringify),
        JSSet = createSet(x => x),
        set;

    beforeEach(function() {
        set = new JSSet();
    });

    describe('mimic', function() {
        it('mimic', function() {
            expect(set.toString()).to.be.equal((new Set()).toString());
        });

        it('mimic', function() {
            expect(set.valueOf() instanceof Set).to.be.true;
        });

        it('mimic', function() {
            set.add({ key: 'val' });

            expect(Array.from(set.valueOf())).to.be.deep.equal([{ key: 'val' }]);
        });
    });

    describe('uniq', function() {
        beforeEach(function() {
            var JSONSet = createSet(JSON.stringify);

            set = new JSONSet();
        });

        it('uniq', function() {
            var JSONSet = createSet(JSON.stringify),
                set = new JSONSet();

            set.add({ key: 'val' });
            set.add({ key: 'val' });

            expect(set.size).to.be.equal(1);
        });

        it('uniq', function() {
            var JSONSet = createSet(JSON.stringify),
                set = new JSONSet();

            set.add({ key: 'val' });

            expect(set.has({ key: 'val' })).to.be.true;
        });
    });

    describe('constructor()', function() {
        it('should support array', function() {
            var set = new JSSet([1, 2, 3]);

            expect(Array.from(set)).to.be.deep.equal([1, 2, 3]);
        });

        it('should support iterable', function() {
            var iterable = new Set([1, 2, 3]);
            var set = new JSSet(iterable);

            expect(Array.from(set)).to.be.deep.equal([1, 2, 3]);
        });
    });

    describe('add()', function() {
        it('should add value', function() {
            set.add(1);

            expect(Array.from(set)).to.be.deep.equal([1]);
        });

        it('should support chains', function() {
            set.add(1).add(2);

            expect(Array.from(set)).to.be.deep.equal([1, 2]);
        });
    });

    describe('size', function() {
        it('should ', function() {
            expect(set.size).to.be.equal(0);
        });

        it('should add value', function() {
            set.add(1);

            expect(set.size).to.be.equal(1);
        });

        it('should ', function() {
            set.add(1).add(2);

            expect(set.size).to.be.equal(2);
        });
    });

    describe('clear()', function() {
        it('should add value', function() {
            set.add(1);
            set.clear();

            expect(Array.from(set)).to.be.empty;
        });

        it('should ', function() {
            set.clear();

            expect(Array.from(set)).to.be.empty;
        });
    });

    describe('delete()', function() {
        it('should add value', function() {
            set.add(1);
            set.add(2);

            set.delete(1);

            expect(Array.from(set)).to.be.deep.equal([2]);
        });

        it('should ', function() {
            set.delete(1);

            expect(Array.from(set)).to.be.empty;
        });
    });

    describe('iterators', function() {
        beforeEach(function() {
            set.add(1);
            set.add(2);
        });

        it('should be iterable', function() {
            var arr = [];

            for (let v of set) {
                arr.push(v);
            }

            expect(arr).to.be.deep.equal([1, 2]);
        });

        it('entries()', function() {
            expect(Array.from(set.entries())).to.be.deep.equal([1, 2]);
        });

        it('keys()', function() {
            expect(Array.from(set.keys())).to.be.deep.equal([1, 2]);
        });

        it('values()', function() {
            expect(Array.from(set.values())).to.be.deep.equal([1, 2]);
        });

        it('forEach()', function() {
            var arr = [];

            set.forEach(v => arr.push(v));

            expect(arr).to.be.deep.equal([1, 2]);
        });
    });

    describe('has()', function() {
        it('should add value', function() {
            set.add(1);
            set.add(2);

            expect(set.has(2)).to.be.true;
        });

        it('should add value', function() {
            expect(set.has(3)).to.be.false;
        });
    });
});
