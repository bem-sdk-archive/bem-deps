var expect  = require('chai').expect,
    findIndex = require('../../util').findIndex,
    compare = require('../lib/bem-compare');

describe('bem-sort', function () {
    it('should place block before its element', function () {
        var entities = [
                { block: 'block', elem: 'elem' },
                { block: 'block' }
            ],
            sorted = entities.sort(compare),
            indexBlock = findIndex(sorted, { block: 'block' }),
            indexElem = findIndex(sorted, { block: 'block', elem: 'elem' });

        expect(indexBlock).to.be.below(indexElem);
    });

    it('should place block before its boolean modifier', function () {
        var entities = [
                { block: 'block', modName: 'm', modVal: true },
                { block: 'block' }
            ],
            sorted = entities.sort(compare),
            indexBlock = findIndex(sorted, { block: 'block' }),
            indexModifier = findIndex(sorted, { block: 'block', modName: 'm' });

        expect(indexBlock).to.be.below(indexModifier);
    });

    it('should place block before its key-value modifier', function () {
        var entities = [
                { block: 'block', modName: 'm', modVal: 'any' },
                { block: 'block' }
            ],
            sorted = entities.sort(compare),
            indexBlock = findIndex(sorted, { block: 'block' }),
            indexModifier = findIndex(sorted, { block: 'block', modName: 'm', modVal: 'any' });

        expect(indexBlock).to.be.below(indexModifier);
    });

    it('should place block before its element with boolean modifier', function () {
        var entities = [
                { block: 'block', elem: 'elem', modName: 'm', modVal: true },
                { block: 'block' }
            ],
            sorted = entities.sort(compare),
            indexBlock = findIndex(sorted, { block: 'block' }),
            indexElem = findIndex(sorted, { block: 'block', elem: 'elem', modName: 'm', modVal: true });

        expect(indexBlock).to.be.below(indexElem);
    });

    it('should place block before its element with key-value modifier', function () {
        var entities = [
                { block: 'block', elem: 'elem', modName: 'm', modVal: 'any' },
                { block: 'block' }
            ],
            sorted = entities.sort(compare),
            indexBlock = findIndex(sorted, { block: 'block' }),
            indexElem = findIndex(sorted, { block: 'block', elem: 'elem', modName: 'm', modVal: 'any' });

        expect(indexBlock).to.be.below(indexElem);
    });

    it('should place block\'s boolean modifier before block\' key-value modifier', function () {
        var entities = [
                { block: 'block', modName: 'm', modVal: 'any' },
                { block: 'block', modName: 'n', modVal: true }
            ],
            sorted = entities.sort(compare),
            indexBoolean = findIndex(sorted, { block: 'block', modName: 'n', modVal: true }),
            indexKeyValue = findIndex(sorted, { block: 'block', modName: 'm', modVal: 'any' });

        expect(indexBoolean).to.be.below(indexKeyValue);
    });

    it('should place elem before its boolean modifier', function () {
        var entities = [
                { block: 'block', elem: 'elem', modName: 'm', modVal: true },
                { block: 'block', elem: 'elem' }
            ],
            sorted = entities.sort(compare),
            indexElem = findIndex(sorted, { block: 'block', elem: 'elem' }),
            indexModifier = findIndex(sorted, { block: 'block', elem: 'elem', modName: 'm', modVal: true });

        expect(indexElem).to.be.below(indexModifier);
    });

    it('should place elem before its key-value modifier', function () {
        var entities = [
                { block: 'block', elem: 'elem', modName: 'm', modVal: 'any' },
                { block: 'block', elem: 'elem' }
            ],
            sorted = entities.sort(compare),
            indexElem = findIndex(sorted, { block: 'block', elem: 'elem' }),
            indexModifier = findIndex(sorted, { block: 'block', elem: 'elem', modName: 'm', modVal: 'any' });

        expect(indexElem).to.be.below(indexModifier);
    });

    it('should place elem\'s boolean modifier before elem\' key-value modifier', function () {
        var entities = [
                { block: 'block', elem: 'elem', modName: 'm', modVal: 'any' },
                { block: 'block', elem: 'elem', modName: 'n', modVal: true }
            ],
            sorted = entities.sort(compare),
            indexBoolean = findIndex(sorted, { block: 'block', elem: 'elem', modName: 'n', modVal: true }),
            indexKeyValue = findIndex(sorted, { block: 'block', elem: 'elem', modName: 'm', modVal: 'any' });

        expect(indexBoolean).to.be.below(indexKeyValue);
    });
});
