import { expect } from 'chai';

import СircularDependencyError from '../../lib/graph/circular-dependency-error';

describe.only('`object-set`', function() {
    var loop = [
        { entity: { block: 'A' } },
        { entity: { block: 'B' } },
        { entity: { block: 'A' } }
    ];

    it('rrrs', function() {
        var err = new СircularDependencyError();

        expect(err.name).to.be.equal('СircularDependencyError');
    });

    it('111', function() {
        var err = new СircularDependencyError();

        expect(err.message).to.be.equal('dependency graph has circular dependencies');
    });

    it('sdf', function() {
        var err = new СircularDependencyError();

        expect(err.loop).to.be.empty;
    });

    it('123', function() {
        var err = new СircularDependencyError(loop);

        expect(err.loop).to.be.deep.equal(loop);
    });

    it('123', function() {
        var err = new СircularDependencyError(new Set(loop));

        expect(err.loop).to.be.deep.equal(Array.from(loop));
    });

    it('111', function() {
        var err = new СircularDependencyError(loop);

        expect(err.message).to.be.include('(A <- B <- A)');
    });
});
