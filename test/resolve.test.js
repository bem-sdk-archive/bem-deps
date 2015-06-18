var resolve = require('../lib/index').resolve,
    expect =  require('must'),
    _ = require('lodash');

function isEntityAdded (entities, entity) {
    return _.findIndex(entities, entity) !== -1;
}

describe('resolve', function () {
    describe('input processing', function () {
        it('should return empty result if decl param is not defined', function () {
            var resolved = resolve();

            expect(resolved).to.be.eql({
                entities: [],
                dependOn: []
            });
        });

        it('should return empty result if decl param is empty', function () {
            var resolved = resolve();

            expect(resolved).to.be.eql({
                entities: [],
                dependOn: []
            });
        });

        it('should return identical decl if no deps specified', function () {
            var decl = [
                    { block: 'A' }
                ],
                resolved = resolve(decl);

            expect(resolved.entities).to.be.eql(decl);
        });

        it('should allow to specify single-element deps graph as object', function () {
            var decl = [{ block: 'A' }],
                deps = {
                    entity: { block: 'A' },
                    dependOn: [
                        {
                            entity: { block: 'B' }
                        }
                    ]
                },
                resolved = resolve(decl, deps);

            expect(isEntityAdded(resolved.entities, { block: 'A' })).to.be.true();
        });

        it('should return identical decl for specific tech for unspecified deps declaration', function () {
            var decl = [
                    { block: 'A' }
                ],
                resolved = resolve(decl, undefined, { tech: 'css' });

            expect(resolved.entities).to.be.eql([{ block: 'A' }]);
        });

        it('should return identical decl for specific tech for empty deps declaration', function () {
            var decl = [
                    { block: 'A' }
                ],
                deps = [],
                resolved = resolve(decl, deps, { tech: 'css' });

            expect(resolved.entities).to.be.eql([{ block: 'A' }]);
        });

        it('should ignore tech param if it\'s format differs from { tech: \'%tech_name%\' }', function () {
            var decl = [
                    { block: 'A' }
                ],
                deps = [
                    {
                        entity: { block: 'A' },
                        tech: 'css',
                        dependOn: [{ entity: { block: 'B' } }]
                    }
                ],
                tech = 'css',
                resolved = resolve(decl, deps, tech);

            expect(isEntityAdded(resolved.entities, { block: 'B' })).to.be.false();
        });
    });

    describe('resolving basic dependencies', function () {
        it('should allow entity to depend on another entity', function () {
            var decl = [{ block: 'A' }],
                deps = [
                    {
                        entity: { block: 'A' },
                        dependOn: [{ entity: { block: 'B' } }]
                    }
                ],
                resolved = resolve(decl, deps);

            expect(isEntityAdded(resolved.entities, { block: 'B' })).to.be.true();
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
                resolved = resolve(decl, deps);

            expect(isEntityAdded(resolved.entities, { block: 'B' })).to.be.true();
            expect(isEntityAdded(resolved.entities, { block: 'C' })).to.be.true();
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
                ],
                resolved = resolve(decl, deps);

            expect(resolved.entities).to.be.eql([{ block: 'A' }]);
        });
    });

    describe('resolving entities missing in deps graph', function () {
        it('should include all blocks listed in decl for undefined deps graph', function () {
            var decl = [
                    { block: 'A' },
                    { block: 'B' }
                ],
                resolved = resolve(decl);

            expect(isEntityAdded(resolved.entities, { block: 'A' })).to.be.true();
            expect(isEntityAdded(resolved.entities, { block: 'B' })).to.be.true();
        });

        it('should include all blocks listed in decl for empty deps graph', function () {
            var decl = [
                    { block: 'A' },
                    { block: 'B' }
                ],
                deps = [],
                resolved = resolve(decl, deps);

            expect(isEntityAdded(resolved.entities, { block: 'A' })).to.be.true();
            expect(isEntityAdded(resolved.entities, { block: 'B' })).to.be.true();
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
                ],
                resolved = resolve(decl, deps);

            expect(isEntityAdded(resolved.entities, { block: 'B' })).to.be.false();
        });
    });

    describe('recommended and explicit ordering', function () {
        it('should keep the recommended entities ordering described in decl', function () {
            var decl = [
                    { block: 'A' },
                    { block: 'B' }
                ],
                deps = [],
                resolved = resolve(decl, deps);

            expect(_.findIndex(resolved.entities, { block: 'A' }))
                .to.be.before(_.findIndex(resolved.entities, { block: 'B' }));
        });

        it('should keep the recommended dependencies ordering described in deps', function () {
            var decl = [{ block: 'A' }],
                deps = [
                    {
                        entity: { block: 'A' },
                        dependOn: [
                            { entity: { block: 'B' } }
                        ]
                    }
                ],
                resolved = resolve(decl, deps);

            expect(_.findIndex(resolved.entities, { block: 'A' }))
                .to.be.before(_.findIndex(resolved.entities), { block: 'B' });
        });

        it('should place dependence before dependants if explicitly described in deps graph', function () {
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
                    }
                ],
                resolved = resolve(decl, deps);

            expect(_.findIndex(resolved.entities, { block: 'B' }))
                .to.be.before(_.findIndex(resolved.entities, { block: 'A' }));
        });

        it('should keep the recommended entities order for entities with unspecified ordering', function () {
            var decl = [
                    { block: 'A' },
                    { block: 'B' },
                    { block: 'C' }
                ],
                deps = [
                    {
                        entity: { block: 'B' },
                        dependOn: {
                            entity: { block: 'C' },
                            order: 'dependenceBeforeDependants'
                        }
                    }
                ],
                resolved = resolve(decl, deps);

            expect(_.findIndex(resolved.entities, { block: 'A' }))
                .to.be.before(_.findIndex(resolved.entities, { block: 'C' }));
            expect(_.findIndex(resolved.entities, { block: 'C' }))
                .to.be.before(_.findIndex(resolved.entities, { block: 'B' }));
        });
    });

    describe('resolving dependency cycles', function () {
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

            (function () { resolve(decl, deps); }).must.throw('Unable to process deps: detected cyclic' +
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

            (function () { resolve(decl, deps); }).must.throw('Unable to process deps: detected cyclic' +
                ' reference A <- B <- C <- A');
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

            (function () { resolve(decl, deps); }).must.throw('Unable to process deps: detected cyclic' +
                ' reference B <- C <- B');
        });
    });

    describe('resolving basic dependencies for specific tech', function () {
        it('should allow entity to depend on another entity when resolving deps for specific tech', function () {
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
                resolved = resolve(decl, deps, { tech: 'css' });

            expect(isEntityAdded(resolved.entities, { block: 'B' })).to.be.true();
        });

        it('should allow entity to depend multiple entities when resolving deps for specific tech', function () {
            var decl = [{ block: 'A' }],
                deps = [
                    {
                        entity: { block: 'A' },
                        dependOn: [
                            { entity: { block: 'B' } },
                            { entity: { block: 'C' } }
                        ]
                    }
                ],
                resolved = resolve(decl, deps, { tech: 'css' });

            expect(isEntityAdded(resolved.entities, { block: 'B' })).to.be.true();
            expect(isEntityAdded(resolved.entities, { block: 'C' })).to.be.true();
        });

        it('should ignore dependency if entity depends on itself when resolving deps for specific tech', function () {
            var decl = [
                    { block: 'A' }
                ],
                deps = [
                    {
                        entity: { block: 'A' },
                        dependOn: [{ entity: { block: 'A' } }]
                    }
                ],
                resolved = resolve(decl, deps, { tech: 'css' });

            expect(resolved.entities).to.be.eql([{ block: 'A' }]);
        });
    });

    describe('ignoring tech dependencies when no tech to resolve specified', function () {
        it('should ignore dependency when tech in entity depends on same tech in another entity if no tech to ' +
            'resolve specified', function () {
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
                ],
                resolved = resolve(decl, deps);

            expect(resolved.dependOn).to.be.empty();
        });

        it('should ignore dependency when tech in entity depends on another tech in another entity if no tech to ' +
            'resolve specified', function () {
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
                ],
                resolved = resolve(decl, deps);

            expect(resolved.dependOn).to.be.empty();
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
                ],
                resolved = resolve(decl, deps);

            expect(resolved.dependOn).to.be.empty();
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
                ],
                resolved = resolve(decl, deps);

            expect(resolved.dependOn).to.be.empty();
        });
    });

    describe('tech dependencies grouping', function () {
        it('should add tech dependency to entities list if this tech matching tech for which dependencies ' +
            'are being resolved', function () {
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
                resolved = resolve(decl, deps, { tech: 'js' });

            expect(isEntityAdded(resolved.entities, { block: 'B' })).to.be.true();
        });

        it('should add tech dependency to dependOn section if this tech is not matching tech for which dependencies ' +
            'are being resolved', function () {
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
                resolved = resolve(decl, deps, { tech: 'css' });

            expect(resolved.dependOn).have.length(1);
            expect(resolved.dependOn[0]).to.be.eql({
                tech: 'js',
                entities: [{ block: 'B' }]
            });
        });

        it('should add multiple tech dependencies of same tech to dependOn section to list of entities related to ' +
            'this tech if this tech is not matching tech for which dependencies are being resolved', function () {
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
                            },
                            {
                                entity: { block: 'C' },
                                tech: 'js'
                            }
                        ]
                    }
                ],
                resolved = resolve(decl, deps, { tech: 'css' });

            expect(resolved.dependOn).have.length(1);
            expect(resolved.dependOn[0]).to.include('js');
            expect(isEntityAdded(resolved.dependOn[0].entities, { block: 'B' })).to.be.true();
            expect(isEntityAdded(resolved.dependOn[0].entities, { block: 'C' })).to.be.true();
        });
    });

    describe('tech dependencies recommended and explicit ordering', function () {
        it('should keep recommended order for entities same with resolving tech', function () {
            var decl = [{ block: 'A' }],
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
                resolved = resolve(decl, deps, { tech: 'js' });

            expect(_.findIndex(resolved.entities, { block: 'A' }))
                .to.be.before(_.findIndex(resolved.entities, { block: 'B' }));
        });

        it('should place dependence before dependants in entities list for dependency with same tech with tech ' +
            'being resolved', function () {
            var decl = [
                    { block: 'A' }
                ],
                deps = [
                    {
                        entity: { block: 'A' },
                        dependOn: [
                            {
                                entity: { block: 'B' },
                                tech: 'js',
                                order: 'dependenceBeforeDependants'
                            }
                        ]
                    }
                ],
                resolved = resolve(decl, deps, { tech: 'js' });

            expect(_.findIndex(resolved.entities, { block: 'B' }))
                .to.be.before(_.findIndex(resolved.entities, { block: 'A' }));
        });

        it('should keep recommended ordering in entities list for tech dependencies with save tech with tech ' +
            'being resolved', function () {
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
                ],
                resolved = resolve(decl, deps, { tech: 'js' });

            expect(_.findIndex(resolved.entities, { block: 'C' }))
                .to.be.before(_.findIndex(resolved.entities, { block: 'A' }));
            expect(_.findIndex(resolved.entities, { block: 'A' }))
                .to.be.before(_.findIndex(resolved.entities, { block: 'B' }));
        });
    });

    describe('resolving \'tech <- entity\' dependencies for specific tech', function () {
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
                resolved = resolve(decl, deps, { tech: 'css' });

            expect(resolved.entities).to.include({ block: 'B' });
        });

        it('should allow tech in entity to depend on multiple entities', function () {
            var decl = [
                    { block: 'A' }
                ],
                deps = [
                    {
                        entity: { block: 'A' },
                        tech: 'css',
                        dependOn: [
                            { entity: { block: 'B' } },
                            { entity: { block: 'C' } }
                        ]
                    }
                ],
                resolved = resolve(decl, deps, { tech: 'css' });

            expect(resolved.entities).to.include({ block: 'B' });
            expect(resolved.entities).to.include({ block: 'C' });
        });

        it('should ignore dependency if tech in entity depends on itself', function () {
            var decl = [
                    { block: 'A' }
                ],
                deps = [
                    {
                        entity: { block: 'A' },
                        tech: 'css',
                        dependOn: [{ entity: { block: 'A' } }]
                    }
                ],
                resolved = resolve(decl, deps, { tech: 'css' });

            expect(resolved.entities).to.be.eql([{ block: 'A' }]);
        });
    });

    describe('resolving \'tech <- tech\' dependencies for specific tech', function () {
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
                resolved = resolve(decl, deps, { tech: 'js' });

            expect(resolved.dependOn).have.length(1);
            expect(resolved.dependOn[0]).to.include('css');
            expect(isEntityAdded(resolved.dependOn[0].entities, { block: 'B' })).to.be.true();
        });

        it('should allow tech in entity to depend on several other techs of different entities', function () {
            var decl = [
                    { block: 'A' }
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
                ],
                resolved = resolve(decl, deps, { tech: 'js' });

            expect(resolved.dependOn).to.be.eql([
                {
                    entities: [{ block: 'C' }],
                    tech: 'css'
                },
                {
                    entities: [{ block: 'D' }],
                    tech: 'bh'
                }
            ]);
        });

        it('should allow tech in entity to depend on several other techs of entity', function () {
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
                            },
                            {
                                entity: { block: 'B' },
                                tech: 'bh'
                            }
                        ]
                    }
                ],
                resolved = resolve(decl, deps, { tech: 'js' });

            expect(resolved.dependOn).to.be.eql([
                {
                    entities: [{ block: 'B' }],
                        tech: 'css'
                },
                {
                    entities: [{ block: 'B' }],
                        tech: 'bh'
                }
            ]);
        });
    });

    describe('ignoring tech dependencies not matching with tech being resolved', function () {
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
                resolved = resolve(decl, deps, { tech: 'js' });

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
                resolved = resolve(decl, deps, { tech: 'js' });

            expect(resolved.dependOn).to.be.empty();
        });
    });
});
