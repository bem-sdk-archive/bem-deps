var stringifyEntity = require('bem-naming').stringify;

export default class DependencyGraph {
    constructor() {
        this._entityMap = new Map();
        this._orderedDependencyMap = new Map();
        this._unorderedDependencyMap = new Map();
    }
    addDependency(fromEntity, toEntity, params={}) {
        var fromId = stringifyEntity(fromEntity),
            toId = stringifyEntity(toEntity);

        this._entityMap.set(fromId, fromEntity);
        this._entityMap.set(toId, toEntity);

        var map = params.order
            ? this._orderedDependencyMap
            : this._unorderedDependencyMap;

        if (!map.has(fromId)) {
            map.set(fromId, new Set());
        }

        map.get(fromId).add(toId);
    }
    entities() {
        return this._entityById.values();
    }
    entitiesFrom(entity) {
        var iterator = new DependencyGraphIterator(this._graph);

        return {
            value: entity,
            done: true
        }
    }
};

// DependencyGraph.prototype.dependenciesOf = function(entity) {
//     return [].concat(
//         this.orderedDependenciesOf(entity),
//         this.unorderedDependenciesOf(entity)
//     );
// };
//
// DependencyGraph.prototype.orderedDependenciesOf = function(entity) {
//     return this._getDependencies(this._orderedDependenceIdsById, entity);
// };
//
// DependencyGraph.prototype.unorderedDependenciesOf = function(entity) {
//     return this._getDependencies(this._unorderedDependenceIdsById, entity);
// };
//
// DependencyGraph.prototype._getDependencies = function(map, entity) {
//     var id = stringifyEntity(entity);
//
//     if (!map.has(id)) return [];
//
//     var dependencies = [];
//
//     map.get(id).forEach(function(id) {
//         var entity = this._entityById.get(id);
//         dependencies.push(entity);
//     }, this);
//
//     return dependencies;
// };
