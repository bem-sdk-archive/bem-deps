var expect = require('chai').expect,
    resolve = require('../../lib/index').resolve;

describe('resolve', function () {
    describe('resolving dependency cycles', function () {
        it('should not throw error if detected direct implicit cyclic dependency', function () {
            var decl = [
                    { block: 'A' },
                    { block: 'B' }
                ],
                deps = [
                    {
                        entity: { block: 'A' },
                        dependOn: [
                            { entity: { block: 'B' } }
                        ]
                    },
                    {
                        entity: { block: 'B' },
                        dependOn: [
                            { entity: { block: 'A' } }
                        ]
                    }
                ];

            expect(function () { resolve(decl, deps); }).to.not.throw();
        });

        it('should not throw error if detected indirect implicit cyclic dependency', function () {
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
                                entity: { block: 'B' }
                            }
                        ]
                    },
                    {
                        entity: { block: 'B' },
                        dependOn: [
                            {
                                entity: { block: 'С' }
                            }
                        ]
                    },
                    {
                        entity: { block: 'C' },
                        dependOn: [
                            {
                                entity: { block: 'A' }
                            }
                        ]
                    }
                ];

            expect(function () { resolve(decl, deps); }).to.not.throw();
        });

        it('should not throw error if detected intermediate implicit cyclic dependency', function () {
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
                                entity: { block: 'B' }
                            }
                        ]
                    },
                    {
                        entity: { block: 'B' },
                        dependOn: [
                            {
                                entity: { block: 'C' }
                            }
                        ]
                    },
                    {
                        entity: { block: 'C' },
                        dependOn: [
                            {
                                entity: { block: 'B' }
                            }
                        ]
                    }
                ];

            expect(function () { resolve(decl, deps); }).to.not.throw();
        });

        it('should not throw error if detected direct cycle where entity A has weak dependency on entity B' +
            ' and entity B has strong dependency on entity A', function () {
            var decl = [
                    { block: 'A' },
                    { block: 'B' }
                ],
                deps = [
                    {
                        entity: { block: 'A' },
                        dependOn: [
                            { entity: { block: 'B' } }
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

            expect(function () { resolve(decl, deps); }).to.not.throw();
        });

        it('should not throw error if detected indirect cycle where entity A has weak dependency on entity C' +
            ' and entity C has strong dependency on entity A', function () {
            var decl = [
                    { block: 'A' },
                    { block: 'B' }
                ],
                deps = [
                    {
                        entity: { block: 'A' },
                        dependOn: [
                            { entity: { block: 'B' } }
                        ]
                    },
                    {
                        entity: { block: 'B' },
                        dependOn: [
                            { entity: { block: 'C' } }
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

            expect(function () { resolve(decl, deps); }).to.not.throw();
        });

        it('should not throw error if detected intermediate cycle where entity B has weak dependency on entity C' +
            ' and entity C has strong dependency on entity B', function () {
            var decl = [
                    { block: 'A' },
                    { block: 'B' }
                ],
                deps = [
                    {
                        entity: { block: 'A' },
                        dependOn: [
                            { entity: { block: 'B' } }
                        ]
                    },
                    {
                        entity: { block: 'B' },
                        dependOn: [
                            { entity: { block: 'C' } }
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

            expect(function () { resolve(decl, deps); }).to.not.throw();
        });

        it('should throw error if detected direct cyclic explicit dependency', function () {
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

            expect(function () { resolve(decl, deps); }).to.throw('Unable to process deps: detected cyclic' +
                ' reference A <- B <- A');
        });

        it('should throw error if detected indirect cyclic explicit dependency', function () {
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

            expect(function () { resolve(decl, deps); }).to.throw('Unable to process deps: detected cyclic' +
                ' reference A <- B <- C <- A');
        });

        it('should throw error if detected intermediate explicit cyclic dependency', function () {
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

            expect(function () { resolve(decl, deps); }).to.throw('Unable to process deps: detected cyclic' +
                ' reference B <- C <- B');
        });
    });
});
