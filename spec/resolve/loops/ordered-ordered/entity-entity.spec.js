var expect  = require('chai').expect,
    resolve = require('../../../../lib/index').resolve;

describe('resolving loops: ordered-ordered for entity-entity dependencies', function () {
    it('should not throw error if detected loop on itself', function () {
        var decl = [{ block: 'A' }],
            deps = [{
                entity: { block: 'A' },
                dependOn: [{
                    entity: { block: 'A' },
                    order: 'dependenceBeforeDependants'
                }]
            }];

        expect(function () { resolve(decl, deps); }).to.not.throw();
    });

    it('should throw error if detected direct loop', function () {
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

    it('should throw error if detected indirect loop', function () {
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

    it('should throw error if detected intermediate loop', function () {
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
