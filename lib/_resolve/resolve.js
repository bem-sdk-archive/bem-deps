var stringifyEntity = require('bem-naming').stringify,
    bemTypeOf = require('bem-naming').typeOf,
    parseId = require('bem-naming').parse,
    DependencyError = require('./dependency-error');

module.exports = function (declaration, relations, options) {
    var entitiesByScope = {},
        blocks = {},
        mods = {},
        elems = {},
        elemMods = {},
        dependenciesById = {},
        genRelation = []

    var declarationDependencies = {};

    relations.forEach(function (relation) {
        var entity = relation.entity,
            scope = entity.block,
            id = stringifyEntity(entity);

        typeReduce(entity);

        if (!options.tech && relation.tech) return;
        if (options.tech && relation.tech && relation.tech !== options.tech) return;

        entitiesByScope[scope] = (entitiesByScope[scope] || []).concat(entity);

        dependenciesById[id] = (dependenciesById[id] || []);
        relation.dependOn.forEach(function (dependency) {
            typeReduce(entity);

            if (
                (options.tech && relation.tech && dependency.tech && dependency.tech !== relation.tech)
                ||
                (options.tech && !relation.tech && dependency.tech && dependency.tech !== options.tech)
            ) {
                declarationDependencies[dependency.tech] = (declarationDependencies[dependency.tech] || { has: {}, data: [] });

                var idt = stringifyEntity(dependency.entity);

                if (!declarationDependencies[dependency.tech].has[idt]) {
                    declarationDependencies[dependency.tech].data.push(dependency.entity);
                    declarationDependencies[dependency.tech].has[idt] = true;
                }
            } else {
                dependenciesById[id].push(dependency);
            }
        });
    });

    declaration.forEach(function (entity) {
        typeReduce(entity);
    });

    function typeReduce(entity) {
        var id = stringifyEntity(entity);
        var type = bemTypeOf(entity);

        if (type === 'block') {
            blocks[id] = entity;
        } else if (type === 'blockMod') {
            mods[id] = entity;
        } else if (type === 'elem') {
            elems[id] = entity;
        } else if (type === 'elemMod') {
            elemMods[id] = entity;
        }
    }

    Object.keys(mods).forEach(function(id) {
        var entity = mods[id],
            blockId = entity.block,
            block = blocks[blockId];

        if (block && !(dependenciesById[id] || []).some(function (dependency) {
            return dependency.order && stringifyEntity(dependency.entity) === blockId;
        })) {
            genRelation.push({
                entity: entity,
                dependOn: block,
                order: 'blockBeforeBlockModifier'
            });
        }
    });

    Object.keys(elems).forEach(function(id) {
        var entity = elems[id],
            blockId = entity.block,
            block = blocks[entity.block];

        if (block && !(dependenciesById[id] || []).some(function (dependency) {
            return dependency.order && stringifyEntity(dependency.entity) === blockId;
        })) {
            genRelation.push({
                entity: entity,
                dependOn: block,
                order: 'blockBeforeElement'
            });
        }
    });

    Object.keys(elemMods).forEach(function(id) {
        var entity = elemMods[id],
            elemId = stringifyEntity({ block: entity.block, elem: entity.elem }),
            elem = elems[elemId];

        if (elem && !(dependenciesById[id] || []).some(function (dependency) {
            return dependency.order && stringifyEntity(dependency.entity) === elemId;
        })) {
            genRelation.push({
                entity: entity,
                dependOn: elem,
                order: 'ElementBeforeElementModifier'
            });
        }
    });

    console.log(genRelation);

    var visitedEntities = {},
        inResult = {},
        slices = [],
        resolvedDeclaration = [];

    declaration.forEach(function (entity) {
        var scope = entity.block;

        entitiesByScope[scope] = (entitiesByScope[scope] || []).concat(entity);

        var necessaryEntities = walkFrom(entity);

        necessaryEntities.unorderedDependencies.unshift(entity);

        // console.log('decl entity: ', entity);
        // console.log('ordered: ', necessaryEntities.orderedDependencies);
        // console.log('unordered: ', necessaryEntities.unorderedDependencies);

        slices.push(necessaryEntities);
    });

    slices.forEach(function (necessaryEntities) {
        var scopeEntities = [];
        var has = {};

        necessaryEntities.orderedDependencies.forEach(add);

        necessaryEntities.unorderedDependencies
           .forEach(function (entity) {
               var id = stringifyEntity(entity);
               var scope = entity.block;

               if (!has[scope]) {
                   entitiesByScope[scope].forEach(function (entity) {
                       var sid = stringifyEntity(entity);

                       if (sid !== id) {
                            scopeEntities.push(entity);
                       }
                   });
               }
           });

       var unorderedDependencies = necessaryEntities.unorderedDependencies.concat(scopeEntities);
       var old = [].concat(unorderedDependencies);

       unorderedDependencies
           .sort(function (entity1, entity2, i) {
               var l1 = Object.keys(entity1).length,
                   l2 = Object.keys(entity2).length;

               if (entity1.modVal === true) {
                   l1 -= 0.1;
               }

               if (entity2.modVal === true) {
                   l2 -= 0.1;
               }

               if (l1 - l2 === 0) {
                   return old.indexOf(entity1) - old.indexOf(entity2);
               }

               return l1 - l2;
           })
           .forEach(add);
    });

    function add(entity) {
        var id = stringifyEntity(entity);

        if (!inResult[id]) {
            inResult[id] = true;
            resolvedDeclaration.push(entity);
        }
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
        // console.log('step: ', track);

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

    // console.log('resolved: ', resolvedDeclaration);
    // console.log('dependOn: ', Object.keys(declarationDependencies));

    return {
        entities: resolvedDeclaration,
        dependOn: Object.keys(declarationDependencies).map(function (tech) {
            return {
                tech: tech,
                entities: declarationDependencies[tech].data
            };
        })
    };
};
