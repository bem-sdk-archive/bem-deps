import { expect } from 'chai';
import { resolve } from '../../lib/index';

describe('resolve: slices', function () {
    it('111', function () {
        var decl = [
                { block: 'page' }
            ],
            relations = [{
                "entity": {
                    "block": "page"
                },
                "dependOn": [
                    {
                        "entity": {
                            "block": "i-bem"
                        },
                        "order": "dependenceBeforeDependants"
                    },
                    {
                        "entity": {
                            "block": "i-bem",
                            "elem": "dom",
                            // "modName": "init",
                            // "modVal": "auto"
                        }
                    },
                    {
                        "entity": {
                            "block": "ua"
                        }
                    },
                    {
                        "entity": {
                            "block": "page",
                            "elem": "css",
                            // "modName": "init",
                            // "modVal": "auto"
                        }
                    }
                ]
            }];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            {
             "block": "i-bem"
            },
            {
             "block": "page"
            },
            {
             "block": "i-bem",
             "elem": "dom",
            //  "modName": "init",
            //  "modVal": "auto"
            },
            {
             "block": "ua"
            },
            {
             "block": "page",
             "elem": "css"
            //  "modName": "init",
            //  "modVal": "auto"
            }
        ]);
    });

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
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'A' },
            { block: 'C' },
            { block: 'B' },
            { block: 'D' }
        ]);
    });

    it('234', function () {
        var decl = [
                { block: 'A' }
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    dependOn: [{
                        entity: { block: 'B' },
                        order: true
                    },{
                        entity: { block: 'C' },
                        order: true
                    }]
                }
            ];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'B' },
            { block: 'C' },
            { block: 'A' }
        ]);
    });

    it('444', function () {
        var decl = [
                { block: 'A' }
            ],
            relations = [
                {
                    entity: { block: 'A' },
                    dependOn: [{
                        entity: { block: 'B' },
                        order: true
                    },{
                        entity: { block: 'D' }
                    },{
                        entity: { block: 'C' },
                        order: true
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

        var resolved = resolve(decl, relations);

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

        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'C' },
            { block: 'A' },
            { block: 'D' },
            { block: 'B' }
        ]);
    });
});
