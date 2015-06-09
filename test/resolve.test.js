var bemDeps = require('../lib/deps');

describe('resolve', function () {
    it('should not process empty decl list', function () {
        bemDeps.resolve()
            .must.throw('The decl list is empty or not defined. It\'s impossible to to resolve empty decl list');
    });

    it('should return identical decl list if no deps specified', function () {
        var decl = [
            { block: 'A' },
            { block: 'B' }
        ];
        bemDeps.resolve(decl).must.be.eql({
            entities: decl,
            dependOn: []
        });
    });

    it('should include all blocks listed in decl even if they are missing in deps description', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' },
                { block: 'C' },
                { block: 'D' }
            ],
            deps = [
                {
                    entity: { block: 'C' },
                    dependOn: {
                        entity: { block: 'E' }
                    }
                }
            ];
        bemDeps.resolve(decl, deps).must.be.eql({
            entities: [{ block: 'A' }, { block: 'B' }, { block: 'C' }, { block: 'D' }, { block: 'E' }],
            dependOn: []
        });
    });

    it('should not include dependency if it\'s missing in decl and nobody from decl references it', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' },
                { block: 'C' }
            ],
            deps = [
                {
                    entity: { block: 'D' },
                    dependOn: [
                        {
                            entity: { block: 'A' }
                        }
                    ]
                }
            ];
        bemDeps.resolve(decl, deps).must.be.eql({
            entities: [{ block: 'A' }, { block: 'B' }, { block: 'C' }],
            dependOn: []
        });
    });

    it('should allow entity to depend on multiple entities', function () {
        var decl = [
                { block: 'A' }
            ],
            deps = [
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
        bemDeps.resolve(decl, deps).must.be.eql({
            entities: [{ block: 'A' }, { block: 'B' }, { block: 'C' }],
            dependOn: []
        });
    });

    it('should ignore entity depend on itself', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' },
                { block: 'C' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'A' }
                        }
                    ]
                }
            ];
        bemDeps.resolve(decl, deps).must.be.eql({
            entities: [{ block: 'A' }, { block: 'B' }, { block: 'C' }],
            dependOn: []
        });
    });

    it('should place dependence before dependants', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            order: 'dependenceBeforeDependants'
                        },
                        {
                            entity: { block: 'C' }
                        }
                    ]
                }
            ];
        bemDeps.resolve(decl, deps).must.be.eql({
            entities: [{ block: 'B' }, { block: 'A' }, { block: 'C' }],
            dependOn: []
        });
    });

    it('should keep the order of declaration', function () {
        var decl = [
           { block: 'A' },
           { block: 'B' },
           { block: 'C' },
           { block: 'D' }

        ],
        deps = [
            {
                entity: { block: 'B' },
                dependOn: {
                    entity: { block: 'D' },
                    order: 'dependenceBeforeDependants'
                }
            }
        ];
        bemDeps.resolve(decl, deps).must.be.eql({
            entities: [{ block: 'A' }, { block: 'D' }, { block: 'B' }, { block: 'C' }],
            dependOn: []
        });
    });

    it('should not allow direct cyclic dependencies', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'A' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ];
        bemDeps.resolve(decl, deps).must.throw('Unable to process deps: detected cyclic reference A <- B <- A');
    });

    it('should not allow indirect cyclic dependencies', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' },
                { block: 'C' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    dependOn: [
                        {
                            entity: { block: 'С' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'C' },
                    dependOn: [
                        {
                            entity: { block: 'A' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ];
        bemDeps.resolve(decl, deps).must.throw('Unable to process deps: detected cyclic reference A <- B <- C <- A');
    });
});
