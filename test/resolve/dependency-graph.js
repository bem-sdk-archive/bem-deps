var expect = require('chai').expect,
    DependencyGraph = require('../../lib/resolve/dependency-graph');

describe('resolve::DependencyGraph()', function () {
    it('should return empty array if specified id is not exist', function () {
        var dependencyGraph = new DependencyGraph();

        expect(dependencyGraph.getDependenciesById('non-existing')).to.be.deep.equal([]);
    });

    it('should return empty array if entity with specified id not has dependencies', function () {
        var dependencyGraph = new DependencyGraph();

        dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });

        expect(dependencyGraph.getDependenciesById('B')).to.be.deep.equal([]);
    });

    it('should add dependency', function () {
        var dependencyGraph = new DependencyGraph();

        dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });

        expect(dependencyGraph.getDependenciesById('A')).to.be.deep.equal([
            { block: 'B' }
        ]);
    });

    it('should add same dependency only once', function () {
        var dependencyGraph = new DependencyGraph();

        dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });
        dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });

        expect(dependencyGraph.getDependenciesById('A')).to.be.deep.equal([
            { block: 'B' }
        ]);
    });

    it('should add another dependency', function () {
        var dependencyGraph = new DependencyGraph();

        dependencyGraph.addDependency({ block: 'A' }, { block: 'B' });
        dependencyGraph.addDependency({ block: 'A' }, { block: 'C' });

        expect(dependencyGraph.getDependenciesById('A')).to.be.deep.equal([
            { block: 'B' }, { block: 'C' }
        ]);
    });
});
