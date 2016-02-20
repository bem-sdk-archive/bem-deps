import { expect } from 'chai';

import BemEntity from '../../lib/bem/bem-entity';

describe('`bem-entity`', function() {
    describe('errors', function() {
        it('should throw error for if entity object is not valid', function() {
            expect(function () { new BemEntity({ elem: 'elem' }); })
                .to.be.throw('This is not valid BEM entity: the field `block` is undefined.');
        });
    });

    describe('fields', function() {
        it('should provide `block` field', function() {
            const entity = new BemEntity({ block: 'block' });

            expect(entity.block).to.be.equal('block');
        });

        it('should provide `elem` field', function() {
            const entity = new BemEntity({ block: 'block', elem: 'elem' });

            expect(entity.elem).to.be.equal('elem');
        });

        it('should provide `modName` field', function() {
            const entity = new BemEntity({ block: 'block', modName: 'mod' });

            expect(entity.modName).to.be.equal('mod');
        });

        it('should provide `modVal` field', function() {
            const entity = new BemEntity({ block: 'block', modName: 'mod', modVal: 'val' });

            expect(entity.modVal).to.be.equal('val');
        });
    });

    describe('normalize', function() {
        it('should normalize boolean modifier of block', function() {
            const entity = new BemEntity({ block: 'block', modName: 'mod' });

            expect(entity.modVal).to.be.true;
        });

        it('should normalize boolean modifier of elem', function() {
            const entity = new BemEntity({ block: 'block', elem: 'elem', modName: 'mod' });

            expect(entity.modVal).to.be.true;
        });
    });

    describe('type', function() {
        it('should get type for block', function() {
            const entity = new BemEntity({ block: 'block' });

            expect(entity.type).to.be.equal('block');
        });

        it('should get type for modifier of block', function() {
            const entity = new BemEntity({ block: 'block', modName: 'mod' });

            expect(entity.type).to.be.equal('blockMod');
        });

        it('should get type for element', function() {
            const entity = new BemEntity({ block: 'block', elem: 'elem' });

            expect(entity.type).to.be.equal('elem');
        });

        it('should get type for modifier of element', function() {
            const entity = new BemEntity({ block: 'block', elem: 'elem', modName: 'mod' });

            expect(entity.type).to.be.equal('elemMod');
        });
    });

    describe('id', function() {
        it('should build id for block', function() {
            const entity = new BemEntity({ block: 'block' });

            expect(entity.id).to.be.equal('block');
        });

        it('should build id for modifier of block', function() {
            const entity = new BemEntity({ block: 'block', modName: 'mod', modVal: 'val' });

            expect(entity.id).to.be.equal('block_mod_val');
        });

        it('should build id for boolean modifier of block', function() {
            const entity = new BemEntity({ block: 'block', modName: 'mod' });

            expect(entity.id).to.be.equal('block_mod');
        });

        it('should build id for element', function() {
            const entity = new BemEntity({ block: 'block', elem: 'elem' });

            expect(entity.id).to.be.equal('block__elem');
        });

        it('should build id for modifier of element', function() {
            const entity = new BemEntity({ block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' });

            expect(entity.id).to.be.equal('block__elem_mod_val');
        });

        it('should build id for boolean modifier of element', function() {
            const entity = new BemEntity({ block: 'block', elem: 'elem', modName: 'mod' });

            expect(entity.id).to.be.equal('block__elem_mod');
        });
    });

    describe('toString()', function() {
        it('should return id', function() {
            const entity = new BemEntity({ block: 'block' });

            expect(entity.toString()).to.be.equal(entity.id);
        });
    });

    describe('valueOf()', function() {
        it('should return entity object', function() {
            const obj = { block: 'block' };
            const entity = new BemEntity(obj);

            expect(entity.valueOf()).to.be.deep.equal(obj);
        });
    });

    describe('is()', function() {
        it('should detect equal block', function() {
            const entity1 = new BemEntity({ block: 'block' });
            const entity2 = new BemEntity({ block: 'block' });

            expect(entity1.is(entity2)).to.be.true;
        });

        it('should not detect another block', function() {
            const entity1 = new BemEntity({ block: 'block1' });
            const entity2 = new BemEntity({ block: 'block2' });

            expect(entity1.is(entity2)).to.be.false;
        });
    });
});
