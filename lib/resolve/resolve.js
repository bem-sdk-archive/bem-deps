import { stringify as stringifyEntity } from 'bem-naming';
import DependencyGraph from './dependency-graph';
import addNativeDependencies from './add-native-dependencies';
import isRelationWithRequiredTech from './is-relation-with-required-tech';
import isDeclarationDependency from './is-declaration-dependency';

export default function resolve(declaration, relations, options) {
    var requiredTech = options.tech,
        dependencyGraph = new DependencyGraph(),
        dependenceEntitiesByTech = new Map();

    for (let relation of relations) {
        if (!isRelationWithRequiredTech(relation, requiredTech)) continue;

        for (let dependency of relation.dependOn) {
            if (isDeclarationDependency(relation.tech, dependency.tech, requiredTech)) {
                addDeclarationDependency(dependency);
            } else {
                dependencyGraph.addDependency(relation.entity, dependency.entity, { order: dependency.order });
            }
        }
    }

    function addDeclarationDependency(dependency) {
        var tech = dependency.tech;

        if (!dependenceEntitiesByTech.has(tech)) {
            dependenceEntitiesByTech.set(tech, []);
        }

        dependenceEntitiesByTech.get(tech).push(dependency.entity);
    }

    var declarationDependOn = [];
    dependenceEntitiesByTech.forEach(function(dependenceEntities, tech) {
        declarationDependOn.push({
            tech: tech,
            entities: dependenceEntities
        });
    });

    addNativeDependencies(declaration, dependencyGraph);

    var visitedIds = new Set(),
        addedIds = new Set(),
        resolvedDeclaration = [];

    for (let declarationEntity of declaration) {
        var beforeEntities = [],
            afterEntities = [];

        for (let [dependenceEntity, entityId, order] of dependencyGraph.entitiesFrom(declarationEntity)) {
            if (visitedIds.has(entityId)) continue;

            visitedIds.add(entityId);

            if (order) {
                beforeEntities.unshift(dependenceEntity);
            } else {
                afterEntities.push(dependenceEntity)
            }
        }

        for (let dependenceEntity of beforeEntities) {
            let dependenceEntityId = stringifyEntity(dependenceEntity);
            if (!addedIds.has(dependenceEntityId)) {
                resolvedDeclaration.push(dependenceEntity);
                addedIds.add(dependenceEntityId);
            }
        }

        var declarationEntityId = stringifyEntity(declarationEntity);
        if (!addedIds.has(declarationEntityId)) {
            resolvedDeclaration.push(declarationEntity);
            addedIds.add(declarationEntityId);
        }

        for (let dependenceEntity of afterEntities) {
            let dependenceEntityId = stringifyEntity(dependenceEntity);
            if (!addedIds.has(dependenceEntityId)) {
                resolvedDeclaration.push(dependenceEntity);
                addedIds.add(dependenceEntityId);
            }
        }
    };

    return {
        entities: resolvedDeclaration,
        dependOn: declarationDependOn
    };
};
