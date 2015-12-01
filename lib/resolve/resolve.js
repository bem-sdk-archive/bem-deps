var bemNaming = require('bem-naming'),
    stringifyEntity = bemNaming.stringify,
    entityType = bemNaming.typeOf,
    DependencyGraph = require('./dependency-graph'),
    DependencyError = require('./dependency-error'),
    ResolvedRelations = require('./relation-info');

module.exports = function (declaration, relations, options) {
    var entitiesIdByType = {
            blocks: new Set(),
            blockMods: new Set(),

            elems: new Set(),
            elemMods: new Set()
        },
        entitiesById = {},
        visitedEntities = {},
        dependencyGraph = new DependencyGraph(),
        resolvedDeclaration = new Set(),
        declarationDependenciesByTech = {};

    relations
        .filter(filterRelationByTech)
        .forEach(function (relation) {
            var dependentEntity = relation.entity,
                dependentId = stringifyEntity(dependentEntity),
                dependentType = entityType(dependentEntity);

            entitiesIdByType[dependentType].add(dependentId);

            relation.dependOn.forEach(function(dependency) {
                if (isDeclarationDependency(dependency.tech, relation.tech)) {
                    addDeclarationDependency(dependency);
                } else {
                    dependencyGraph.addDependency(relation.entity, dependency.entity);
                }
            });
        });

    generateNativeDependencies();

    declaration.forEach(function (entity) {
        var necessaryEntities = walkFrom(entity);

        necessaryEntities.orderedDependencies.forEach(function (dependenceEntity) {
            resolvedDeclaration.add(dependenceEntity);
        });

        necessaryEntities.add(entity);

        necessaryEntities.unorderedDependencies.forEach(function (dependenceEntity) {
            resolvedDeclaration.add(dependenceEntity);
        });
    });

    return {
        entities: Array.from(resolvedDeclaration),
        dependOn: relationInfo.getDependencies.toArray()
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

    function walkFrom(entity) {
        var id = stringifyEntity(entity),
            track = [id],
            orderedDependencies = [],
            unorderedDependencies = [];

        step(track, orderedDependencies, unorderedDependencies);

        return {
            orderedDependencies: orderedDependencies,
            unorderedDependencies: unorderedDependencies
        };
    };

    function step(track, orderedDependencies, unorderedDependencies) {
        var previousId = track[track.length - 1];

        if (visitedEntities[previousId]) {
            return;
        }

        visitedEntities[previousId] = true;

        var dependenciesOfPreviousEntity = dependenciesById[previousId];

        if (dependenciesOfPreviousEntity) {
            dependenciesOfPreviousEntity.forEach(function (dependency) {
                var entity = dependency.entity,
                    id = stringifyEntity(entity);

                var scope = entity.block;

                entitiesByScope[scope] = (entitiesByScope[scope] || []).concat(entity);

                // игнорируем зависимость самого на себя
                if (previousId === id) {
                    return;
                }

                if (dependency.order === 'dependenceBeforeDependants') {
                    // проверяем нет ли циклической ordered-зависимости
                    var loopFirstIndex = track.indexOf(id);
                    if (loopFirstIndex !== -1) {
                        // добавляем в цепь замыкающую сущность
                        track.push(id);

                        // формируем цепь для ошибки
                        var errorInfo = track.slice(loopFirstIndex).map(function (key) {
                            return {
                                entity: parseId(key)
                            };
                        });

                        throw new DependencyError(errorInfo);
                    }

                    orderedDependencies.unshift(entity);

                    return step(track.concat(id), orderedDependencies, unorderedDependencies);
                } else {
                    unorderedDependencies.push(entity);

                    return step([id], orderedDependencies, unorderedDependencies);
                }
            });
        }
    }
};
