var bemDeps = require('../lib/deps'),
    expect =  require('must');

describe('resolve', function () {
    it('should not process empty decl list', function () {
        (function () { bemDeps.resolve(); })
            .must.throw('The decl list is empty or not defined. It\'s impossible to to resolve empty decl list');
    });

    it('should return identical decl list if no deps specified', function () {
        var decl = [
            { block: 'A' }
        ];

        bemDeps.resolve(decl).entities.must.be.eql(decl);
    });

    it('should include all blocks listed in decl even if they are missing in deps description', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [],
            resolved = bemDeps.resolve(decl, deps);

        expect(resolved.entities).to.include({ block: 'A' });
        expect(resolved.entities).to.include({ block: 'B' });
    });

    it('should not include dependency if it\'s missing in decl and nobody from decl references it', function () {
        var decl = [
                { block: 'A' }
            ],
            deps = [
                {
                    entity: { block: 'B' },
                    dependOn: [
                        { entity: { block: 'A' } }
                    ]
                }
            ];

        expect(bemDeps.resolve(decl, deps)).not.to.include({ block: 'B' });
    });

    it('should keep the recommended entities ordering described in decl', function () {
        var blockA = { block: 'A' },
            blockB = { block: 'B' },
            decl = [blockA, blockB],
            deps = [],
            resolved = bemDeps.resolve(decl, deps);

        expect(resolved.entities.indexOf(blockA)).to.be.before(resolved.entities.indexOf(blockB));
    });

    it('should keep the recommended dependencies ordering described in deps', function () {
        var blockA = { block: 'A' },
            blockB = { block: 'B' },
            decl = [blockA],
            deps = [
                {
                    entity: blockA,
                    dependOn: [
                        { entity: blockB }
                    ]
                }
            ],
            resolved = bemDeps.resolve(decl, deps);

        expect(resolved.entities.indexOf(blockA)).to.be.before(resolved.entities.indexOf(blockB));
    });

    it('should allow entity to depend on multiple entities', function () {
        var decl = [
                { block: 'A' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        { entity: { block: 'B' } },
                        { entity: { block: 'C' } }
                    ]
                }
            ],
            resolved = bemDeps.resolve(decl, deps);

        expect(resolved).to.include({ block: 'B' });
        expect(resolved).to.include({ block: 'C' });
    });

    it('should ignore entity depend on itself', function () {
        var decl = [
                { block: 'A' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        { entity: { block: 'A' } }
                    ]
                }
            ];

        expect(bemDeps.resolve(decl, deps).entities).to.be.eql([{ block: 'A' }]);
    });

    it('should place dependence before dependants', function () {
        var blockA = { block: 'A' },
            blockB = { block: 'B' },
            decl = [blockA, blockB],
            deps = [
                {
                    entity: blockA,
                    dependOn: [
                        {
                            entity: blockB,
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            resolved = bemDeps.resolve(decl, deps);

        expect(resolved.entities.indexOf(blockB)).to.be.before(resolved.entities.indexOf(blockA));
    });

    it('should keep the recommended entities order for entities with unspecified ordering', function () {
        var blockA = { block: 'A' },
            blockB = { block: 'B' },
            blockC = { block: 'C' },
            decl = [blockA, blockB, blockC],
            deps = [
                {
                    entity: blockB,
                    dependOn: {
                        entity: blockC,
                        order: 'dependenceBeforeDependants'
                    }
                }
            ],
            resolved = bemDeps.resolve(decl, deps);

        expect(resolved.entities.indexOf(blockA)).to.be.before(resolved.entities.indexOf(blockC));
        expect(resolved.entities.indexOf(blockC)).to.be.before(resolved.entities.indexOf(blockB));
    });

    it('should throw error if detected direct cyclic dependencies', function () {
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

        (function () { bemDeps.resolve(decl, deps); }).must.throw('Unable to process deps: detected cyclic' +
            ' reference A <- B <- A');
    });

    it('should throw error if detected indirect cyclic dependencies', function () {
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

        (function () { bemDeps.resolve(decl, deps); }).must.throw('Unable to process deps: detected cyclic reference' +
            ' A <- B <- C <- A');
    });

    it('should throw error if detected intermediate cyclic dependencies', function () {
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
                            entity: { block: 'C' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'C' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ];

        (function () { bemDeps.resolve(decl, deps); }).must.throw('Unable to process deps: detected cyclic reference' +
            ' B <- C <- B');
    });

    it('should resolve deps for specific tech for unspecified deps declaration', function () {
        var decl = [
                { block: 'A' }
            ],
            deps = [];

        expect(bemDeps.resolve(decl, deps, { tech: 'css' }).entities).to.be.eql([{ block: 'A' }]);
    });

    it('should resolve deps list for specific tech for specified deps declaration', function () {
        var decl = [
                { block: 'A' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        { entity: { block: 'B' } }
                    ]
                }
            ],
            resolved = bemDeps.resolve(decl, deps, { tech: 'css' });

        expect(resolved.entities).to.include({ block: 'A' });
        expect(resolved.entities).to.include({ block: 'B' });
    });

    it('should allow tech in entity to depend on another entity', function () {
        var decl = [
                { block: 'A' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        { entity: { block: 'B' } }
                    ]
                }
            ],
            resolved = bemDeps.resolve(decl, deps, { tech: 'css' });

        expect(resolved.entities).to.include({ block: 'A' });
        expect(resolved.entities).to.include({ block: 'B' });
    });

    it('should ignore dependency when tech in entity depends on same tech in another entity if no tech to resolve ' +
        'specified', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'js',
                    dependsOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'js'
                        }
                    ]
                }
            ];

        expect(bemDeps.resolve(decl, deps).dependOn).to.be.empty();
    });

    it('should ignore dependency when tech in entity depends on another tech in another entity if no tech to resolve ' +
        'specified', function () {
        var decl = [{ block: 'A' }],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'js',
                    dependsOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        }
                    ]
                }
            ];

        expect(bemDeps.resolve(decl, deps).dependOn).to.be.empty();
    });

    it('should ignore dependency when tech of entity depend on another entities if no tech to resolve' +
        ' specified', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'js',
                    dependOn: [
                        { entity: { block: 'C' } }
                    ]
                }
            ];

        expect(bemDeps.resolve(decl, deps).dependOn).to.be.empty();
    });

    it('should ignore dependency when tech of entity depend on another entities if no tech to resolve ' +
        'specified and ordering set', function () {
        var decl = [
                { block: 'A' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'js',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ];

        expect(bemDeps.resolve(decl, deps).dependOn).to.be.empty();
    });

    it('should allow tech in one entity to depend on another tech in another entity', function () {
        var decl = [
                { block: 'A' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'js',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        }
                    ]
                }
            ],
            resolved = bemDeps.resolve(decl, deps, { tech: 'js' });

        expect(resolved.dependOn).have.length(1);
        expect(resolved.dependOn[0]).to.include('css');
        expect(resolved.dependOn[0].entities).to.include({ block: 'B' });
    });

    it('should add tech dependency to entities list if this tech matching tech for which dependencies ' +
        'are being resolved now', function () {
        var decl = [
                { block: 'A' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'js'
                        }
                    ]
                }
            ],
            resolved = bemDeps.resolve(decl, deps, { tech: 'js' });

        expect(resolved.entities).to.include({ block: 'A' });
        expect(resolved.entities).to.include({ block: 'B' });
    });

    it('should keep order for tech dependencies same with resolving tech', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'js',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ];

        bemDeps.resolve(decl, deps, { tech: 'js' }).must.be.eql({
            entities: [{ block: 'C' }, { block: 'A' }, { block: 'B' }],
            dependOn: []
        });
    });

    it('should allow tech to depend on several other techs', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'js',
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'css'
                        },
                        {
                            entity: { block: 'D' },
                            tech: 'bh'
                        }
                    ]
                }
            ];

        bemDeps.resolve(decl, deps, { tech: 'js' }).must.be.eql({
            entities: [{ block: 'A' }, { block: 'B' }],
            dependOn: [
                {
                    entities: [{ block: 'C' }],
                    tech: 'css'
                },
                {
                    entities: [{ block: 'D' }],
                    tech: 'bh'
                }
            ]
        });
    });

    it('should ignore tech dependencies not matching with tech being resolved', function () {
        var decl = [
                { block: 'A' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'js'
                        }
                    ]
                }
            ],
            resolved = bemDeps.resolve(decl, deps, { tech: 'js' });

        expect(resolved.dependOn).to.be.empty();
    });

    it('should ignore tech dependencies not matching with tech being resolved when ordering set', function () {
        var decl = [
                { block: 'A' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'js',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            resolved = bemDeps.resolve(decl, deps, { tech: 'js' });

        expect(resolved.dependOn).to.be.empty();
    });
});
