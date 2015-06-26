var expect  = require('chai').expect,
    resolve = require('../../../../lib/index').resolve;

describe('resolving loops: unordered-unordered for tech-tech deps', function () {
    it('should not throw error if detected loop on itself and all techs are matching with resolving tech', function () {
        var decl = [{ block: 'A' }],
            deps = [{
                entity: { block: 'A' },
                tech: 'css',
                dependOn:[{
                    entity: { block: 'A' },
                    tech: 'css',
                    order: 'dependenceBeforeDependants'
                }]
            }],
            opts = { tech: 'css' };

        expect(function () { resolve(decl, deps, opts); }).to.not.throw();
    });

    it('should not throw error if detected loop on itself and one of techs is not matching with resolving ' +
        'tech', function () {
        var decl = [{ block: 'A' }],
            deps = [{
                entity: { block: 'A' },
                tech: 'css',
                dependOn:[{
                    entity: { block: 'A' },
                    tech: 'js',
                    order: 'dependenceBeforeDependants'
                }]
            }],
            opts = { tech: 'css' };

        expect(function () { resolve(decl, deps, opts); }).to.not.throw();
    });

    it('should not throw error if detected direct loop and all techs are matching with resolving tech', function () {
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

    it('should not throw error if detected direct loop and one of techs is not with matching resolving ' +
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
                            tech: 'js'
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

    it('should not throw error if detected indirect loop and all techs are with matching resolving tech', function () {
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
                            tech: 'css'
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
                            tech: 'js'
                        }
                    ]
                },
                {
                    entity: { block: 'B' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'C' },
                            tech: 'css'
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

    it('should not throw error if detected intermediate loop and all techs are matching with resolving ' +
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
                            tech: 'css'
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

    it('should not throw error if detected intermediate loop and one of techs is not matching with resolving ' +
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
                            tech: 'js'
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

    it('should not throw error if detected ordered loop broken in the middle by unordered dependency and all techs ' +
        'are matching with resolving tech', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' },
                { block: 'C' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech:'css',
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
                            tech: 'css'
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
            ];

        expect(function () { resolve(decl, deps); }).to.not.throw();
    });

    it('should not throw error if detected ordered loop broken in the middle by unordered dependency and one of ' +
        'techs is not matching with resolving tech', function () {
        var decl = [
                { block: 'A' },
                { block: 'B' },
                { block: 'C' }
            ],
            deps = [
                {
                    entity: { block: 'A' },
                    tech:'css',
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
                            tech: 'css'
                        }
                    ]
                },
                {
                    entity: { block: 'C' },
                    tech: 'css',
                    dependOn: [
                        {
                            entity: { block: 'A' },
                            tech: 'js',
                            order: 'dependenceBeforeDependants'
                        }
                    ]
                }
            ];

        expect(function () { resolve(decl, deps); }).to.not.throw();
    });
});
