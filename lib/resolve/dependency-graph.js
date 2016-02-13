import Entity from '../bem/bem-entity';
import BemSet from '../bem/bem-set';
import DependencyError from '../graph/dependency-error';

/**
 *
 */
export default class DependencyGraph {
    constructor() {
        this._entities = new EntitySet();

        this._unorderedDependencies = new Map();
        this._orderedDependencies = new Map();
    }
    /**
     * @param {Object} entity
     */
    addEntity(entity) {
        this._entities.add(entity);
    }
    /**
     * @param {Object} dependant
     * @param {Object} dependency
     * @param {Object} info
     */
    addDependency(dependant, dependency, info={}) {
        var { orderedDependencies, unorderedDependencies } = this._immediateDependenciesOf(dependant);

        this._entities
            .add(dependant)
            .add(dependency);

        (info.order ? orderedDependencies : unorderedDependencies)
            .add(dependency);
    }
    /**
     * @param {Object} dependant
     * @returns {unorderedDependencies, orderedDependencies}
     */
    // _immediateDependenciesOf(entity) {
    //     var id = entity.id,
    //         unorderedMap = this._unorderedDependencies,
    //         orderedMap = this._orderedDependencies;
    //
    //     // init
    //     unorderedMap.has(id) || unorderedMap.set(id, new Set());
    //     orderedMap.has(id)   || orderedMap.set(id, new Set());
    //
    //     return {
    //         orderedDependencies:   orderedMap.get(id),
    //         unorderedDependencies: unorderedMap.get(id)
    //     };
    // }
    // _transitiveDependenciesOf(entity) {
    //     var graph = this;
    //
    //     return {
    //         [Symbol.iterator]: function* () {
    //             function* step(entity, track) {
    //                 track.push(entity);
    //
    //                 var { orderedDependencies, unorderedDependencies } = this._immediateDependenciesOf(entity);
    //
    //                 for (let entity of orderedDependencies) {
    //                     let orderedTrack = step(entity, track);
    //
    //                     orderedTrack.reverse().forEach(entity => yield entity);
    //                 }
    //
    //                 yield entity;
    //
    //                 for (let entity of unorderedDependencies) {
    //                     let track = step(entity, track);
    //
    //                     orderedTrack.forEach(entity => yield entity);
    //                 }
    //
    //                 if (orderedDependencies.size === 0) {
    //                     return track;
    //                 }
    //
    //                 return tracks;
    //             }
    //
    //             var track = new EntitySet([startEntity]);
    //
    //             yield* step(startEntity, track);
    //
    //
    //
    //
    //             function* step(previous, track) {
    //                 if (visited.has(previous)) return;
    //
    //                 visited.add(previous);
    //
    //                 var { orderedDependencies, unorderedDependencies } = this._immediateDependenciesOf(previous);
    //
    //                 for (let entity of orderedDependencies) {
    //                     // игнорируем зависимость самого на себя
    //                     if (previous.is(entity)) continue;
    //
    //                     // проверяем нет ли циклической ordered-зависимости
    //                     if (track.has(entity)) {
    //                         // добавляем в цепь замыкающую сущность
    //                         track.add(entity);
    //
    //                         throw new DependencyError(track);
    //                     }
    //
    //                     yield [dependency, dependency.id, ordered, previous];
    //
    //                     track.add(dependency);
    //
    //                     yield* step(dependency, track);
    //                 }
    //
    //                 for (let entity of unorderedDependencies) {
    //                     // игнорируем зависимость самого на себя
    //                     if (previous.is(entity)) continue;
    //
    //                     res.push();
    //
    //                     track.add(dependency);
    //
    //                     yield* step(dependency, track);
    //                 }
    //             }
    //
    //             var track = new EntitySet([startEntity]);
    //
    //             yield* step(startEntity, track);
    //         }
    //     };
    // }
    // transitiveDependenciesOf(entity) {
    //    for (let {dependence, previous, info} of dependencyGraph.entitiesFrom(declarationEntity)) {
    //        if (entity.is(dependence)) continue;
    //
    //        visitedIds.add(dependenceEntity.id);
    //
    //        let idx = indexOf(previousId);
    //
    //        if (order) {
    //            // [0, 1, 2].splice(1, 0, 4) => [0, 4, 1, 2]
    //            entities.splice(idx, 0, dependenceEntity);
    //        } else {
    //            entities.push(dependenceEntity);
    //        }
    //    }
    //
    //    for (let dependenceEntity of entities) {
    //        let dependenceEntityId = stringifyEntity(dependenceEntity);
    //        if (!addedIds.has(dependenceEntityId)) {
    //            resolvedDeclaration.push(dependenceEntity);
    //            addedIds.add(dependenceEntityId);
    //        }
    //    }
    // }
    // entitiesFrom(startEntity) {
    //     var graph = this,
    //         entities = this._entities,
    //         visited = new EntitySet();
    //
    //     return {
    //         [Symbol.iterator]: function* () {
    //             function* step(previous, track) {
    //                 if (visited.has(previous)) return;
    //
    //                 visited.add(previous);
    //
    //                 for (let {entity, ordered, tech} of this.immediateDependenciesOf(previous)) {
    //                     // игнорируем зависимость самого на себя
    //                     if (previous.is(entity)) continue;
    //
    //                     // проверяем нет ли циклической ordered-зависимости
    //                     if (ordered && track.has(entity)) {
    //                         // добавляем в цепь замыкающую сущность
    //                         track.add(entity);
    //
    //                         throw new DependencyError(track);
    //                     }
    //
    //                     yield [dependency, dependency.id, ordered, previous];
    //
    //                     track.add(dependency);
    //
    //                     yield* step(dependency, track);
    //
    //                     yield [dependency, id, false, previousId];
    //
    //                     yield* step(dependency, new EntitySet([startEntity]));
    //                 }
    //             }
    //
    //             var track = new EntitySet([startEntity]);
    //
    //             yield* step(startEntity, track);
    //         }
    //     };
    // }
    // entitiesFrom(startEntity) {
    //     var graph = this,
    //         entities = this._entities,
    //         visitedIds = new Set();
    //
    //     return {
    //         [Symbol.iterator]: function* () {
    //             function* step(previous, track) {
    //                 var previousId = previous.id;
    //
    //                 if (visitedIds.has(previousId)) return;
    //
    //                 visitedIds.add(previousId);
    //
    //                 for (let dependency of this.immediateDependenciesOf(previous, { order: true })) {
    //                     // игнорируем зависимость самого на себя
    //                     if (previousId === dependency.id) continue;
    //
    //                     // проверяем нет ли циклической ordered-зависимости
    //                     var loopFirstIndex = track.indexOf(id);
    //                     if (loopFirstIndex !== -1) {
    //                         // добавляем в цепь замыкающую сущность
    //                         track.push(id);
    //                         // формируем цепь для ошибки
    //                         var errorInfo = track.slice(loopFirstIndex).map(function (key) {
    //                             return {
    //                                 entity: parseId(key)
    //                             };
    //                         });
    //                         throw new DependencyError(errorInfo);
    //                     }
    //
    //                     yield [dependency, dependency.id, true, previousId];
    //
    //                     track.add(dependency);
    //
    //                     yield* step(dependency, track);
    //                 }
    //
    //                 for (let dependency of this.immediateDependenciesOf(previous, { order: false })) {
    //                     // игнорируем зависимость самого на себя
    //                     if (previousId === dependency.id) continue;
    //
    //                     yield [dependency, id, false, previousId];
    //
    //                     yield* step(dependency, new EntitySet([startEntity]));
    //                 }
    //             }
    //
    //             var track = new EntitySet([startEntity]);
    //
    //             yield* step(startEntity, track);
    //         }
    //     };
    // }
    // /**
    //  * @returns {Iterator}
    //  */
    // dependenciesOf(entities) {
    //     var visitedIds = new Set(),
    //            addedIds = new Set(),
    //            resolvedDeclaration = [];
    //
    //        for (let declarationEntity of declaration) {
    //            var entities = [];
    //
    //            visitedIds.add(declarationEntity.id);
    //            declarationEntity.id = stringifyEntity(declarationEntity);
    //            entities.push(declarationEntity);
    //
    //            var indexOf = entityId => entities.map(v => v.id).indexOf(entityId);
    //
    //            for (let [dependenceEntity, _, order, previousId] of dependencyGraph.entitiesFrom(declarationEntity)) {
    //                if (declarationEntity.id === dependenceEntity.id) continue;
    //                if (visitedIds.has(dependenceEntity.id)) continue;
    //
    //                visitedIds.add(dependenceEntity.id);
    //
    //                let idx = indexOf(previousId);
    //
    //                if (order) {
    //                    // [0, 1, 2].splice(1, 0, 4) => [0, 4, 1, 2]
    //                    entities.splice(idx, 0, dependenceEntity);
    //                } else {
    //                    entities.push(dependenceEntity);
    //                }
    //            }
    //
    //            for (let dependenceEntity of entities) {
    //                let dependenceEntityId = stringifyEntity(dependenceEntity);
    //                if (!addedIds.has(dependenceEntityId)) {
    //                    resolvedDeclaration.push(dependenceEntity);
    //                    addedIds.add(dependenceEntityId);
    //                }
    //            }
    //        };
    // }
}
