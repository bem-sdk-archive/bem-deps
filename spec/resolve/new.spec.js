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

    it('should put incoming relation as 567', function () {
        var decl = [
                { block: 'dropdown' },
            ],
            relations = [
                {
                    "entity": {
                        "block": "dropdown"
                    },
                    "dependOn": [
                        {
                            "entity": {
                                "block": "popup",
                                "modName": "target",
                                "modVal": true
                            }
                        },
                        {
                            "entity": {
                                "block": "popup"
                            }
                        },
                        {
                            "entity": {
                                "block": "popup",
                                "modName": "target",
                                "modVal": "anchor"
                            }
                        },
                    ]
                }
            ];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'dropdown' },
            { block: "popup" },
            {
                "block": "popup",
                "modName": "target",
                "modVal": true
            },
            {
                "block": "popup",
                "modName": "target",
                "modVal": "anchor"
            }
        ]);
    });

    it('should put incoming relation as 890', function () {
        var decl = [
                { block: 'dropdown' },
            ],
            relations = [
                {
                    "entity": {
                        "block": "dropdown"
                    },
                    "dependOn": [
                        {
                            "entity": {
                                "block": "popup"
                            }
                        },
                        {
                            "entity": {
                                "block": "popup",
                                "modName": "target",
                                "modVal": "anchor"
                            }
                        },
                        {
                            "entity": {
                                "block": "popup",
                                "modName": "target",
                                "modVal": true
                            }
                        },
                    ]
                }
            ];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'dropdown' },
            { block: "popup" },
            {
                "block": "popup",
                "modName": "target",
                "modVal": true
            },
            {
                "block": "popup",
                "modName": "target",
                "modVal": "anchor"
            }
        ]);
    });

    it('56e7', function () {
        var decl = [
                { block: 'dropdown' },
            ],
            relations = [
                {
                    "entity": {
                        "block": "dropdown"
                    },
                    "dependOn": [
                        {
                            "entity": {
                                "block": "a"
                            }
                        },
                        {
                            "entity": {
                                "block": "b"
                            }
                        }
                    ]
                },
                {
                    "entity": {
                        "block": "b"
                    },
                    "dependOn": [
                        {
                            "entity": {
                                "block": "c"
                            },
                            "order": true
                        }
                    ]
                }
            ];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'dropdown' },
            { block: 'a' },
            { block: 'c' },
            { block: 'b' },
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
                        entity: { block: 'B-1' },
                        order: true
                    },{
                        entity: { block: 'D-4' }
                    },{
                        entity: { block: 'C-2' },
                        order: true
                    }]
                }
            ];
        var resolved = resolve(decl, relations);

        expect(resolved.entities).to.deep.equal([
            { block: 'B-1' },
            { block: 'C-2' },
            { block: 'A' },
            { block: 'D-4' }
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
