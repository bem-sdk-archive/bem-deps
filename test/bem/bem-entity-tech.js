import { expect } from 'chai';

import BemEntity from '../../lib/bem/bem-entity';
import BemEntityTech from '../../lib/bem/bem-entity-tech';

describe('`bem-entity-tech`', function() {
    describe('constructor()', function() {
        it('should create instance', function() {
            var instance = new BemEntityTech({
                entity: { block: 'block' },
                tech: 'js'
            });

            expect(instance).to.exist;
        });

        it('should throw error if entity is not specified', function() {
            expect(function () { new BemEntityTech({ tech: 'js' }) })
                .to.be.throw('This is not valid BEM entity.');
        });

        it('should create instance if tech is not specified', function() {
            const instance = new BemEntityTech({ entity: { block: 'block' } });

            expect(instance).to.exist;
        });

        it('should support BemEntity', function() {
            const entity   = new BemEntity({ block: 'block' });
            const instance = new BemEntityTech({ entity: entity });

            expect(instance.entity).to.be.equal(entity);
        });

        it('should convert object to BemEntity', function() {
            const entity   = { block: 'block' };
            const instance = new BemEntityTech({ entity: entity });

            expect(instance.entity).to.be.an.instanceof(BemEntity);
        });

        it('should not modify the object', function() {
            const entity   = { block: 'block' };
            const obj      = { entity: entity };
            const instance = new BemEntityTech(obj);

            expect(function () {
                new BemEntityTech(obj)
            }).to.not.change(obj, 'entity');
        });

        it('should convert object to BemEntity', function() {
            const entity   = { block: 'block' };
            const instance = new BemEntityTech({ entity: entity });

            expect(instance.entity).to.be.an.instanceof(BemEntity);
        });
    });

    describe('fields', function() {
        it('should provide `entity` field', function() {
            const instance = new BemEntityTech({ entity: { block: 'block' } });

            expect(instance.entity).to.be.deep.equal(new BemEntity({ block: 'block' }));
        });

        it('should provide `tech` field', function() {
            const instance = new BemEntityTech({
                entity: { block: 'block' },
                tech: 'js'
            });

            expect(instance.tech).to.be.equal('js');
        });
    });

    describe('id', function() {
        it('should build id for entity', function() {
            const instance = new BemEntityTech({
                entity: { block: 'block', elem: 'elem', modName: 'mod', modVal: 'val' }
            });

            expect(instance.id).to.be.equal('block__elem_mod_val');
        });

        it('should build id without tech', function() {
            const instance = new BemEntityTech({
                entity: { block: 'block' }
            });

            expect(instance.id).to.be.equal('block');
        });

        it('should build id with tech', function() {
            const instance = new BemEntityTech({
                entity: { block: 'block' },
                tech: 'js'
            });

            expect(instance.id).to.be.equal('block.js');
        });
    });

    describe('toString()', function() {
        it('should return id', function() {
            const instance = new BemEntityTech({ entity: { block: 'block' } });

            expect(instance.toString()).to.be.equal(instance.id);
        });
    });

    describe('valueOf()', function() {
        it('should return object', function() {
            const obj      = { entity: { block: 'block' } };
            const instance = new BemEntityTech(obj);

            expect(instance.valueOf()).to.be.deep.equal(obj);
        });

        it('should return entity object', function() {
            const entity   = { block: 'block' };
            const instance = new BemEntityTech({ entity: entity });

            expect(instance.valueOf().entity).to.be.deep.equal(entity);
        });

        it('should not add `tech` field', function() {
            const instance = new BemEntityTech({ entity: { block: 'block' } });

            expect(instance.valueOf()).to.not.have.property('tech');
        });
    });

    describe('is()', function() {
        it('should detect equal block', function() {
            const instance1 = new BemEntityTech({ entity: { block: 'block' } });
            const instance2 = new BemEntityTech({ entity: { block: 'block' } });

            expect(instance1.is(instance2)).to.be.true;
        });

        it('should not detect another block', function() {
            const instance1 = new BemEntityTech({ entity: { block: 'block1' } });
            const instance2 = new BemEntityTech({ entity: { block: 'block2' } });

            expect(instance1.is(instance2)).to.be.false;
        });

        it('should not detect block with another tech', function() {
            const instance1 = new BemEntityTech({
                entity: { block: 'block' }
            });
            const instance2 = new BemEntityTech({
                entity: { block: 'block' },
                tech: 'js'
            });

            expect(instance1.is(instance2)).to.be.false;
        });
    });
});
