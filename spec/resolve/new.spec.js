import { expect } from 'chai';
import { resolve } from '../../lib/index';

describe('new specs', function () {
    it('should resolve unordered dependencies независимо for each declaration entity', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    dependOn: [{
                        entity: { block: 'C' }
                    }]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [{
                        entity: { block: 'D' }
                    }]
                }
            ];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'A' },
            { block: 'C' },

            { block: 'B' },
            { block: 'D' }
        ]);
    });

    it('should resolve ordered dependencies независимо for each declaration entity', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    dependOn: [{
                        entity: { block: 'C' },
                        order: 'dependenceBeforeDependants'
                    }]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [{
                        entity: { block: 'D' },
                        order: 'dependenceBeforeDependants'
                    }]
                }
            ];

        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'C' },
            { block: 'A' },

            { block: 'D' },
            { block: 'B' }
        ]);
    });

    it('should оставить declaration order when resolve ordered and unordered of another dependency', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            order: 'dependenceBeforeDependants'
                        },
                        {
                            entity: { block: 'D' }
                        }
                    ]
                }
            ];

        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'C' },
            { block: 'A' },
            { block: 'D' },

            { block: 'B' }
        ]);
    });


    it('should resolve ordered dependencies независимо от declaration entity', function () {
        var decl = [
                { block: 'A' },
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    dependOn: [{
                        entity: { block: 'B' }
                    }]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [{
                        entity: { block: 'C' },
                        order: 'dependenceBeforeDependants'
                    }]
                }
            ];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'A' },

            { block: 'C' },
            { block: 'B'}
        ]);
    });

    it('should resolve ordered dependencies независимо от unordered dependency of declaration entity', function () {
        var decl = [
                { block: 'A' },
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' }
                        },
                        {
                            entity: { block: 'C' }
                        }
                    ]
                },
                {
                    entity: { block: 'C' },
                    dependOn: [{
                        entity: { block: 'D' },
                        order: 'dependenceBeforeDependants'
                    }]
                }
            ];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'A' },
            { block: 'B' },

            { block: 'D' },
            { block: 'C'}
        ]);
    });

    it('should сохранить user order for ordered dependencies', function () {
        var decl = [
                { block: 'A' }
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            order: 'dependenceBeforeDependants'
                        },
                        {
                            entity: { block: 'C' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'B' },
            { block: 'C' },

            { block: 'A' }
        ]);
    });

    it('should сохранить user order for unordered dependencies', function () {
        var decl = [
                { block: 'A' }
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' }
                        },
                        {
                            entity: { block: 'C' }
                        }
                    ]
                }
            ];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'A' },

            { block: 'B' },
            { block: 'C' }
        ]);
    });

    it('should resolve ordered and unordered dependencies of declaration entity', function () {
        var decl = [
                { block: 'A' }
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    dependOn: [{
                        entity: { block: 'B' },
                        order: 'dependenceBeforeDependants'
                    },{
                        entity: { block: 'D' }
                    },{
                        entity: { block: 'C' },
                        order: 'dependenceBeforeDependants'
                    }]
                }
            ];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'B' },
            { block: 'C' },

            { block: 'A' },

            { block: 'D' }
        ]);
    });
});
