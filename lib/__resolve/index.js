var stringifyEntity = require('bem-naming').stringify,
    isRelation = require('./is-relation'),
    compare = require('./bem-compare'),
    DependencyGraph = require('./dependency-graph/dependency-graph'),
    OrderedGraphWalker = require('./dependency-graph/walkers/ordered-graph-walker'),
    UnorderedGraphWalker = require('./dependency-graph/walkers/unordered-graph-walker');

module.exports = function (declaration, relations, options) {
    declaration || (declaration = []);
    relations || (relations = []);
    options || (options = {});

    if (!Array.isArray(relations)) {
        if (isRelation(relations)) {
            relations = [relations];
        } else if (arguments.length === 2) {
            options = relations;
            relations = [];
        }
    }

    if (typeof options === 'string') {
        options = { tech: options };
    }

    var orderedGraph = new DependencyGraph(),
        unorderedGraph = new DependencyGraph();

    relations.forEach(function (relation) {
        var dependantsEntity = relation.entity;

        if (!options.tech && relation.tech) return;
        if (options.tech && relation.tech && relation.tech !== options.tech) return;

        relation.dependOn.forEach(function (dependence) {
            var dependenceEntity = dependence.entity;

            if (dependence.order === 'dependenceBeforeDependants') {
                orderedGraph.addDependency(dependantsEntity, dependenceEntity);
            } else {
                unorderedGraph.addDependency(dependantsEntity, dependenceEntity);
            }
        });
    });
console.log(orderedGraph._hash);
    var resolvedDeclaration = [],
        addedEntities = {},
        otherEntities = [],
        orderedWalker = new OrderedGraphWalker(orderedGraph, function (entity) {
            var key = stringifyEntity(entity);

            addedEntities[key] = true;
            resolvedDeclaration.unshift(entity);
        }),
        unorderedWalker = new UnorderedGraphWalker(unorderedGraph, function (entity) {
            var key = stringifyEntity(entity);

            if (!addedEntities[key]) {
                otherEntities.push(entity);
            }
        });

    declaration.forEach(function (entity) {
        var key = stringifyEntity(entity),
            dependencies = orderedGraph.dependenciesOf(entity),
            track = [key];

        if (dependencies && dependencies.length > 0) {
            dependencies.forEach(function (dependencyEntity) {
                orderedWalker.walk(dependencyEntity, track);
            });
        }
    });

    declaration.forEach(function (entity) {
        var key = stringifyEntity(entity);

        if (!addedEntities[key]) {
            addedEntities[key] = true;
            otherEntities.push(entity);
        }
    });

    declaration.forEach(function (entity) {
        unorderedWalker.walk(entity);
    });

    otherEntities.sort(compare);

    return {
        entities: resolvedDeclaration.concat(otherEntities.sort(compare)),
        dependOn: []
    };
};
