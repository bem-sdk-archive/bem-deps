import { expect } from 'chai';

import BemEntityTech from '../../lib/bem/bem-entity-tech';
import СircularDependencyError from '../../lib/graph/circular-dependency-error';

describe('СircularDependencyError', function() {
    const loop = [
        { entity: { block: 'A' } },
        { entity: { block: 'B' } },
        { entity: { block: 'A' } }
    ].map(obj => new BemEntityTech(obj));

    it('should has name', function() {
        const err = new СircularDependencyError();

        expect(err.name).to.be.equal('СircularDependencyError');
    });

    it('shold has message', function() {
        const err = new СircularDependencyError();

        expect(err.message).to.be.equal('dependency graph has circular dependencies');
    });

    describe('loop', function() {
        it('should has loop field', function() {
            const err = new СircularDependencyError(loop);

            expect(err.loop).to.be.deep.equal(loop);
        });

        it('should support empty loop', function() {
            const err = new СircularDependencyError();

            expect(err.loop).to.be.empty;
        });

        it('should support iterable', function() {
            const err = new СircularDependencyError(new Set(loop));

            expect(err.loop).to.be.deep.equal(Array.from(loop));
        });

        it('should add loop info to message', function() {
            const err = new СircularDependencyError(loop);

            expect(err.message).to.be.include('(A <- B <- A)');
        });

        it('should support tech info in message', function() {
            const loop = [
                { entity: { block: 'A' }, tech: 'js' },
                { entity: { block: 'B' } },
                { entity: { block: 'A' }, tech: 'js' }
            ].map(obj => new BemEntityTech(obj));
            
            const err = new СircularDependencyError(loop);

            expect(err.message).to.be.include('(A.js <- B <- A.js)');
        });
    });
});
