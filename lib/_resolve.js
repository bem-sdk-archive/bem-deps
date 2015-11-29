var Table = require('cli-table');

var inspect = require('util').inspect,
    naming = require('bem-naming'),
    stringifyEntity = require('bem-naming').stringify;

module.exports = function (decl, relations, options) {
    decl || (decl = []);
    relations || (relations = {});
    options || (options = {});

    var depsGraph = {},
        dependencyTracks = [],
        visited = {},
        entities = [],
        declIndex = {},
        popularity = {};

    var declLength = decl.length;

    decl.forEach(function (entity, index) {
        var key = stringifyEntity(entity);

        visited[key] = true;
        declIndex[key] = declLength - index;
    });

    relations.forEach(function (relation) {
        var key = stringifyEntity(relation.entity);

        visited[key] = true;

        relation.dependOn.forEach(function (dependency) {
            var key = stringifyEntity(dependency.entity);

            visited[key] = true;
            popularity[key] = (popularity[key] || 0) + 1;
        });
    });

    relations.forEach(function (relation) {
        var key = stringifyEntity(relation.entity);

        depsGraph[key] = (depsGraph[key] || []).concat(relation.dependOn);
        // depsGraph[key] = (depsGraph[key] || []).concat(relation.dependOn.map(function (relation) {
        //     return (relation.order ? '*' : '') + stringifyEntity(relation.entity);
        // }));
    });

    var resolvedDecl = Object.keys(visited).sort(function (key1, key2) {
        var isMustDeps = (depsGraph[key1] || []).some(function (dependency) {
            var key = stringifyEntity(dependency.entity);

            return key === key2;
        });

        if (isMustDeps) {
            return 1;
        }

        return ((declIndex[key2] || 0) - (declIndex[key1] || 0)) * 10 + (popularity[key2] || 0) - (popularity[key1] || 0);
    }).filter(function (key) {
        return declIndex[key] || popularity[key];
    });

    // decl.forEach(function (entity) {
    //     var key = stringifyEntity(entity),
    //         dependencies = depsGraph[key],
    //         track = [key];
    //
    //     visited[key] = true;
    //
    //     if (dependencies && dependencies.length > 0) {
    //         walk(track, dependencies);
    //     }
    // });

var table = new Table({ head: ["", "Decl Index", "Popularity"] });

resolvedDecl.forEach(function (key) {
    table.push([key, declIndex[key] || 0, popularity[key] || 0]);
});

// console.log('visited: ', inspect(Object.keys(visited), { depth: null, colors: true }));
// console.log('decl: ', inspect(decl, { depth: null, colors: true }));
// console.log('graph: ', inspect(depsGraph, { depth: null, colors: true }));
// console.log(table.toString());

    return {
        entities: resolvedDecl.map(function (key) {
            return naming.parse(key);
        }),
        dependOn: []
    };

    function walk(track, dependencies) {
        dependencies.forEach(function (dependency) {
            var key = stringifyEntity(dependency.entity),
                dependencies = depsGraph[key];

            if (visited[key]) {
                return;
            }

            visited[key] = true;

            if (dependency.order) {
                track.push(key);
            } else {
                finish(track);
                track = [key];

                entities.push(key);
                popularity[key] = (popularity[key] || 0) + 1;
            }

            if (dependencies && dependencies.length > 0) {
                walk(track, dependencies);
            } else {
                finish(track);
            }

            function finish(track) {
                if (track.length > 1) {
                    dependencyTracks.push(track);
                }
            }
        });
    }
};
