var bemNaming = require('bem-naming'),
    stringifyEntity = bemNaming.stringify,
    entityType = bemNaming.typeOf,
    BemTypifier = require('./bem-typifier'),
    DependencyGraph = require('./dependency-graph'),
    DependencyGraphWalker = require('./dependency-graph-walker'),
    DependencyError = require('./dependency-error'),
    ResolvedRelations = require('./relation-info');

module.exports = function (declaration, relations, options) {
    var bemTypifier = new BemTypifier(),
        dependencyGraph = new DependencyGraph(),
        graphWalker = new DependencyGraphWalker(dependencyGraph),
        resolvedDeclaration = new Set(),
        declarationDependenciesByTech = {};

    relations
        .filter(filterRelationByTech)
        .forEach(function (relation) {
            bemTypifier.typify(relation.entity);

            relation.dependOn.forEach(function(dependency) {
                if (isDeclarationDependency(dependency.tech, relation.tech)) {
                    addDeclarationDependency(dependency);
                } else {
                    bemTypifier.typify(dependency.entity);
                    dependencyGraph.addDependency(relation.entity, dependency.entity);
                }
            });
        });

    declaration.forEach(function (entity) {
        bemTypifier.typify(entity);
    });

    generateNativeDependencies();

    declaration.forEach(function (entity) {
        var necessaryEntities = graphWalker.walkFrom(entity);

        necessaryEntities.orderedDependencies.forEach(function (dependenceEntity) {
            resolvedDeclaration.add(dependenceEntity);
        });

        resolvedDeclaration.add(entity);

        necessaryEntities.unorderedDependencies.forEach(function (dependenceEntity) {
            resolvedDeclaration.add(dependenceEntity);
        });
    });

    return {
        entities: Array.from(resolvedDeclaration),
        dependOn: declarationDependenciesByTech
    };

    function isCommonTech(tech) {
        return !tech || !options.tech;
    }

    function isRequiredTech(tech) {
        if (!options.tech) return true;

        return tech && (tech === options.tech);
    }

    function filterRelationByTech(relation) {
        var tech = relation.tech;

        return isCommonTech(tech) || isRequiredTech(tech);
    }

    function isDeclarationDependency(dependencyTech, dependantTech) {
        if (!options.tech || !dependencyTech) return false;

        if (dependantTech) {
            return dependencyTech !== dependantTech;
        } else {
            return dependencyTech !== options.tech;
        }
    }

    function addDeclarationDependency(dependency) {
        var tech = dependency.tech,
            dependenceEntities = declarationDependenciesByTech[tech] || (declarationDependenciesByTech = []);

        dependenceEntities.push(dependency.entity);
    }

    function generateNativeDependencies() {

    }


};
