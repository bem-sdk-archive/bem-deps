import { expect } from 'chai';

import BemEntity from '../../lib/bem/bem-entity';
import BemEntityTech from '../../lib/bem/bem-entity-tech';
import DependencyMap from '../../lib/graph/dependency-map';

describe('DependencyMap', function() {
    let dependencyMap;

    beforeEach(function () {
        dependencyMap = new DependencyMap();
    });

    describe('addDependency()', function() {
        it('should add dependency to entity', function() {
            const entity = new BemEntity({ block: 'A' });
            const dependency = new BemEntityTech({ entity: { block: 'B' } });

            dependencyMap.addDependency(entity, dependency);

            expect(Array.from(dependencyMap.dependenciesOf(entity))).to.include(dependency);
        });

        it('should add dependency to entity', function() {
            const entity = new BemEntity({ block: 'A' });
            const dependency = new BemEntityTech({ entity: { block: 'B' } });

            dependencyMap.addDependency(entity, dependency);
            dependencyMap.addDependency(entity, dependency);

            expect(Array.from(dependencyMap.dependenciesOf(entity))).to.have.lengthOf(1);
        });

        it('should save order', function() {
            const entity = new BemEntity({ block: 'A' });

            const dependency1 = new BemEntityTech({ entity: { block: 'B' } });
            const dependency2 = new BemEntityTech({ entity: { block: 'C' } });

            dependencyMap.addDependency(entity, dependency1);
            dependencyMap.addDependency(entity, dependency2);

            const dependencies = Array.from(dependencyMap.dependenciesOf(entity));

            expect(dependencies).to.deep.equal([dependency1, dependency2]);
        });

        it('should add dependency to itself', function() {
            const entity = new BemEntity({ block: 'A' });
            const dependency = new BemEntityTech({ entity: entity });

            dependencyMap.addDependency(entity, dependency);

            expect(Array.from(dependencyMap.dependenciesOf(entity))).to.include(dependency);
        });

        it('should not add dependency to other entity', function() {
            const entity1 = new BemEntity({ block: 'A' });
            const entity2 = new BemEntity({ block: 'B' });

            const dependency1 = new BemEntityTech({ entity: { block: 'C' } });
            const dependency2 = new BemEntityTech({ entity: { block: 'D' } });

            dependencyMap.addDependency(entity1, dependency1);
            dependencyMap.addDependency(entity2, dependency2);

            expect(Array.from(dependencyMap.dependenciesOf(entity1))).to.not.include(dependency2);
            expect(Array.from(dependencyMap.dependenciesOf(entity2))).to.not.include(dependency1);
        });

        it('should add unordered dependency', function() {
            const entity = new BemEntity({ block: 'A' });
            const dependency = new BemEntityTech({ entity: { block: 'B' } });

            dependencyMap.addDependency(entity, dependency);

            expect(Array.from(dependencyMap.unorderedDependenciesOf(entity))).to.include(dependency);
        });

        it('should add ordered dependency', function() {
            const entity = new BemEntity({ block: 'A' });
            const dependency = new BemEntityTech({ entity: { block: 'B' } });

            dependencyMap.addDependency(entity, dependency, { ordered: true });

            expect(Array.from(dependencyMap.orderedDependenciesOf(entity))).to.include(dependency);
        });
    });

    describe('unorderedDependenciesOf()', function() {
        it('should return only unordered dependencies', function() {
            const entity = new BemEntity({ block: 'A' });
            const orderedDependency = new BemEntityTech({ entity: { block: 'B' } });
            const unorderedDependency = new BemEntityTech({ entity: { block: 'C' } });

            dependencyMap.addDependency(entity, orderedDependency, { ordered: true });
            dependencyMap.addDependency(entity, unorderedDependency);

            expect(Array.from(dependencyMap.unorderedDependenciesOf(entity)))
                .to.not.include(orderedDependency.valueOf());
        });

        it('should return empty set if not dependencies', function() {
            const entity = new BemEntity({ block: 'A' });

            expect(Array.from(dependencyMap.unorderedDependenciesOf(entity))).to.be.empty;
        });
    });

    describe('orderedDependenciesOf()', function() {
        it('should return only ordered dependencies', function() {
            const entity = new BemEntity({ block: 'A' });
            const orderedDependency = new BemEntityTech({ entity: { block: 'B' } });
            const unorderedDependency = new BemEntityTech({ entity: { block: 'C' } });

            dependencyMap.addDependency(entity, orderedDependency, { ordered: true });
            dependencyMap.addDependency(entity, unorderedDependency);

            expect(Array.from(dependencyMap.unorderedDependenciesOf(entity)))
                .to.not.include(unorderedDependency.valueOf());
        });

        it('should return empty set if not dependencies', function() {
            const entity = new BemEntity({ block: 'A' });

            expect(Array.from(dependencyMap.orderedDependenciesOf(entity))).to.be.empty;
        });
    });

    describe('dependenciesOf()', function() {
        it('should return ordered dependencies above unordered', function() {
            const entity = new BemEntity({ block: 'A' });
            const orderedDependency = new BemEntityTech({ entity: { block: 'B' } });
            const unorderedDependency = new BemEntityTech({ entity: { block: 'C' } });

            dependencyMap.addDependency(entity, orderedDependency, { ordered: true });
            dependencyMap.addDependency(entity, unorderedDependency);

            expect(Array.from(dependencyMap.dependenciesOf(entity))).to.deep.equal([
                orderedDependency,
                unorderedDependency
            ]);
        });

        it('should return empty set if not dependencies', function() {
            const entity = new BemEntity({ block: 'A' });

            expect(Array.from(dependencyMap.dependenciesOf(entity))).to.be.empty;
        });

        it('should return ordered dependencies if unordered is empty', function() {
            const entity = new BemEntity({ block: 'A' });
            const dependency = new BemEntityTech({ entity: { block: 'B' } });

            dependencyMap.addDependency(entity, dependency, { ordered: true });

            expect(Array.from(dependencyMap.dependenciesOf(entity))).to.deep.equal([dependency]);
        });

        it('should return unordered dependencies if ordered is empty', function() {
            const entity = new BemEntity({ block: 'A' });
            const dependency = new BemEntityTech({ entity: { block: 'B' } });

            dependencyMap.addDependency(entity, dependency);

            expect(Array.from(dependencyMap.dependenciesOf(entity))).to.deep.equal([dependency]);
        });
    });
});
