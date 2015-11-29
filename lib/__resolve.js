var stringifyEntity = require('bem-naming').stringify,
    inspect = require('util').inspect,
    Table = require('cli-table');

module.exports = function (decl, relations, options) {
    decl || (decl = []);
    relations || (relations = {});
    options || (options = {});

    var depsGraph = {},
        popularity = {},
        visited = {},
        declIndex = {},
        tracks = [];

    relations.forEach(function (relation) {
        var key = stringifyEntity(relation.entity);

        depsGraph[key] = (depsGraph[key] || []).concat(relation.dependOn);
    });

    var declLength = decl.length;

    decl.forEach(function (entity, index) {
        var key = stringifyEntity(entity),
            dependencies = depsGraph[key];

        visited[key] = true;
        declIndex[key] = declLength - index;

        if (dependencies && dependencies.length > 0) {
            walk([key], dependencies);
        }
    });

    debug();

    return {
        entities: [],
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

                popularity[key] = (popularity[key] || 0) + 1;
            }

            if (dependencies && dependencies.length > 0) {
                walk(track, dependencies);
            } else {
                finish(track);
            }

            function finish(track) {
                if (track.length > 1) {
                    tracks.push(track);
                }
            }
        });
    }

    function debug() {
        var table = new Table({ head: ["", "Decl Index", "Popularity"] });

        Object.keys(visited).forEach(function (key) {
            table.push([key, declIndex[key] || 0, popularity[key] || 0]);
        });

        console.log('decl: ', inspect(decl, { depth: null, colors: true }));
        console.log('graph: ', inspect(depsGraph, { depth: null, colors: true }));
        console.log('visited: ', inspect(Object.keys(visited), { depth: null, colors: true }));
        console.log('tracks: ', inspect(tracks, { depth: null, colors: true }));
        console.log(table.toString());
    }
};
