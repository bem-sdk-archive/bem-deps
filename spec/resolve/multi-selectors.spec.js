import { expect } from 'chai';
import { resolve } from '../../lib/index';

describe('new specs: multi selectors', function () {
    it('1', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    with: [{
                        entity: { block: 'B' }
                    }],
                    dependOn: [{
                        entity: { block: 'C' }
                    }]
                }
            ];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'A' },
            { block: 'B' },

            { block: 'C' }
        ]);
    });

    it('2', function () {
        var decl = [
                { block: 'A' }
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    with: [{
                        entity: { block: 'B' }
                    }],
                    dependOn: [{
                        entity: { block: 'C' }
                    }]
                }
            ];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'A' }
        ]);
    });

    it('3', function () {
        var decl = [
                { block: 'B' }
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    with: [{
                        entity: { block: 'B' }
                    }],
                    dependOn: [{
                        entity: { block: 'C' }
                    }]
                }
            ];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'B' }
        ]);
    });

    it('4', function () {
        var decl = [
                { block: 'A' }
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    with: [{
                        entity: { block: 'B' }
                    }],
                    dependOn: [{
                        entity: { block: 'C' },
                        order: 'dependenceBeforeDependants'
                    }]
                }
            ];
        var resolved = resolve(decl, relations),
            indexDependent = findIndex(resolved.entities, { block: 'A' }),
            indexDependency = findIndex(resolved.entities, { block: 'C' });

        expect(indexDependency).to.be.below(indexDependent);
    });

    it('5', function () {
        var decl = [
                { block: 'A' }
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    with: [{
                        entity: { block: 'B' }
                    }],
                    dependOn: [{
                        entity: { block: 'C' },
                        order: 'dependenceBeforeDependants'
                    }]
                }
            ];
        var resolved = resolve(decl, relations),
            indexDependent = findIndex(resolved.entities, { block: 'B' }),
            indexDependency = findIndex(resolved.entities, { block: 'C' });

        expect(indexDependency).to.be.below(indexDependent);
    });

    it('порядок декларации не должен влиять', function () {
        var decl = [
                { block: 'B' },
                { block: 'A' }
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    with: [{
                        entity: { block: 'B' }
                    }],
                    dependOn: [{
                        entity: { block: 'C' }
                    }]
                }
            ];

        expect(resolved.entities).to.deep.equal([
            { block: 'B' },
            { block: 'A' },

            { block: 'C' }
        ]);
    });
});
