var resolve = require('../../lib/index').resolve,
    expect = require('chai').expect;

describe.only('resolve: slices', function () {
    it('1', function () {
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
        var resolved = resolve();

        expect(resolved.entities).to.deep.equal([
            { block: 'A' },
            { block: 'C' },
            { block: 'B' },
            { block: 'D' }
        ]);
    });

    it('2', function () {
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

        var resolved = resolve();

        expect(resolved.entities).to.deep.equal([
            { block: 'C' },
            { block: 'A' },
            { block: 'D' },
            { block: 'B' }
        ]);
    });

    it('3', function () {
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

        var resolved = resolve();

        expect(resolved.entities).to.deep.equal([
            { block: 'C' },
            { block: 'A' },
            { block: 'D' },
            { block: 'B' }
        ]);
    });
});
