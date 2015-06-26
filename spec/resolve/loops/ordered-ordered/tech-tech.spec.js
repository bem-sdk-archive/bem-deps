var expect  = require('chai').expect,
    resolve = require('../../../../lib/index').resolve;

describe('resolving loops: ordered-ordered for tech-tech dependencies', function () {
    it('should not throw error if detected loop on itself and all techs are matching with resolving tech', function () {
        var decl = [{ block: 'A' }],
            deps = [{
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [{
                    entity: { block: 'A' },
                    tech: 'css',
                    order: 'dependenceBeforeDependants'
                }]
            }],
            opts = { tech: 'css' };

        expect(function () { resolve(decl, deps, opts); }).to.not.throw();
    });

    it('should not throw error if detected loop on itself and one of techs are matching with resolving ' +
        'tech', function () {
        var decl = [{ block: 'A' }],
            deps = [{
                entity: { block: 'A' },
                tech: 'css',
                dependOn: [{
                    entity: { block: 'A' },
                    tech: 'js',
                    order: 'dependenceBeforeDependants'
                }]
            }],
            opts = { tech: 'css' };

        expect(function () { resolve(decl, deps, opts); }).to.not.throw();
    });

    it('should throw error if detected direct loop and both techs are matching with resolving tech', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'A' },
                            tech: 'css',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' };

        expect(function () { resolve(decl, deps, opts); }).to.throw('Unable to process deps: detected cyclic' +
            ' reference A <- B <- A');
    });

    it('should not throw error if detected direct loop and one of techs is not matching with resolving ' +
        'tech', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'js',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'A' },
                            tech: 'css',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' };

        expect(function () { resolve(decl, deps, opts); }).to.not.throw();
    });

    it('should throw error if detected indirect loop and all techs are matching with resolving tech', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' },
                { block: 'C' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'css',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'C' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'A' },
                            tech: 'css',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' };

        expect(function () { resolve(decl, deps, opts); }).to.throw('Unable to process deps: detected cyclic' +
            ' reference A <- B <- C <- A');
    });

    it('should not throw error if detected indirect loop and one of techs is not matching with resolving ' +
        'tech', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' },
                { block: 'C' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'js',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'C' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'A' },
                            tech: 'css',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ],
            opts = { tech: 'css' };

        expect(function () { resolve(decl, deps, opts); }).to.not.throw();
    });

    it('should throw error if detected intermediate loop and all techs are matching with resolving tech', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'css',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'C' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ];

        expect(function () { resolve(decl, deps); }).to.throw('Unable to process deps: detected cyclic' +
            ' reference B <- C <- B');
    });

    it('should not throw error if detected intermediate loop and one of techs is matching with resolving ' +
        'tech', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'js',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                },
                {
                    entity: { block: 'C' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'B' },
                            tech: 'css',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ];

        expect(function () { resolve(decl, deps); }).to.not.throw();
    });
});
