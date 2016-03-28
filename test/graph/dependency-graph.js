import { expect } from 'chai';

import DependencyGraph from '../../lib/graph/Dependency-graph';

describe.only('DependencyGraph', function() {
    describe('addDependency', function() {
        it('should add entity', function () {
            const graph = new DependencyGraph();
            const dependant = { entity: { block: 'A' } };
            const dependency = { entity: { block: 'B' } };

            graph.addDependency(dependant, dependency);

            expect(Array.from(graph.entities())).to.include(dependant.entity);
        });
    });
});
