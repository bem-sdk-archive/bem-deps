var bemNaming = require('bem-naming'),
    stringifyEntity = bemNaming.stringify,
    entityType = bemNaming.typeOf,
    isRelationWithRequiredTech = require('is-relation-with-required-tech'),
    isDeclarationDependency = require('is-declaration-dependency'),
    BemTypifier = require('./bem-typifier'),
    DependencyGraph = require('./dependency-graph'),
    DependencyGraphWalker = require('./dependency-graph-walker'),
    DependencyError = require('./dependency-error'),
    ResolvedRelations = require('./relation-info');

module.exports = function (declaration, relations, options) {
    var requiredTech = options.tech,
        bemTypifier = new BemTypifier(),
        dependencyGraph = new DependencyGraph(),
        graphWalker = new DependencyGraphWalker(dependencyGraph),
        resolvedDeclaration = new Set(),
        dependenceEntitiesByTech = new Map();

    relations
        .forEach(function (relation) {
            if (!isRelationWithRequiredTech(relation, requiredTech)) return;

            bemTypifier.typify(relation.entity);

            relation.dependOn.forEach(function(dependency) {
                if (isDeclarationDependency(relation.tech, dependency.tech, requiredTech)) {
                    addDeclarationDependency(dependency);
                } else {
                    bemTypifier.typify(dependency.entity);

                    dependencyGraph.addDependency(relation.entity, dependency.entity, { order: dependency.order });
                }
            });
        });

    declaration.forEach(function (entity) {
        bemTypifier.typify(entity);
    });

    bemTypifier.getBlockModificators().forEach(function(modifier) {
        var blockId = entity.block,
            modifierDependencies = dependencyGraph.dependenciesOf(modifier),
            hasOrderedDependency = modifierDependencies.some(function(dependency) {
                return dependency.order && stringifyEntity(dependency.entity) === blockId;
            });

        if (!hasOrderedDependency) {
            dependencyGraph.addDependency({ block: blockId }, modifier, { order: 'blockBeforeBlockModifier' });
        }
    });

    bemTypifier.getElementModificators().forEach(function(modifier) {
        var elementId = stringifyEntity({ block: entity.block, elem: entity.elem }),
            modifierDependencies = dependencyGraph.dependenciesOf(modifier),
            hasOrderedDependency = modifierDependencies.some(function(dependency) {
                return dependency.order && stringifyEntity(dependency.entity) === elementId;
            });

        if (!hasOrderedDependency) {
            dependencyGraph.addDependency({ block: entity.block, elem: entity.elem }, modifier, { order: 'elementBeforeElementModifier' });
        }
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

    var declarationDependOn = [];
    dependenceEntitiesByTech.forEach(function(dependenceEntities, tech) {
        declarationDependOn.push({
            tech: tech,
            entities: dependenceEntities
        });
    });

    return {
        entities: Array.from(resolvedDeclaration),
        dependOn: declarationDependOn
    };

    function addDeclarationDependency(dependency) {
        var tech = dependency.tech,
            dependenceEntities = dependenceEntitiesByTech.get(tech) || (dependenceEntitiesByTech.set([]));

        dependenceEntities.push(dependency.entity);
    }

    function generateNativeDependencies() {

    }
};
