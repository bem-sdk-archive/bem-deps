import { stringify as stringifyEntity } from 'bem-naming';

export default class DependencyGraph {
    constructor() {
        this._entityMap = new Map();
        this._dependencyMap = new Map();
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
        return this._entityMap.values();
    }
    entitiesFrom(entity) {
        return {
            [Symbol.iterator]: function () {
                return this;
            },
            next: function () {
                return {
                    done: true
                };
            }
        }
    }
    dependenciesOf(entity) {
        var id = stringifyEntity(entity);

        var entityMap = this._entityMap,
            orderedSet = this._orderedDependencyMap.get(id),
            unorderedSet = this._unorderedDependencyMap.get(id);

        if (!orderedSet && !unorderedSet) return new Set().values();

        var orderedIterator = orderedSet && orderedSet.values(),
            unorderedIterator = unorderedSet && unorderedSet.values();

        return {
            [Symbol.iterator]: function () {
                return this;
            },
            next: function () {
                var item = this._iterator.next(),
                    isDone = item.done;

                if (isDone && this._iterator === orderedIterator) {
                    this._iterator = unorderedIterator;
                }

                return {
                    value: entityMap.get(item.value),
                    done: item.done
                };
            },
            _iterator: orderedIterator || unorderedIterator
        };
    }
    orderedDependenciesOf(entity) {
        return this._dependenciesOfFromMap(entity, this._orderedDependencyMap);
    }
    unorderedDependenciesOf(entity) {
        return this._dependenciesOfFromMap(entity, this._unorderedDependencyMap);
    }
    _dependenciesOfFromMap(entity, map) {
        var id = stringifyEntity(entity);

        var entityMap = this._entityMap,
            dependenceEntities = map.get(id);

        if (!dependenceEntities) return new Set().values();

        var iterator = dependenceEntities.values();

        return {
            [Symbol.iterator]: function () {
                return this;
            },
            next: function () {
                var item = iterator.next();

                return {
                    value: entityMap.get(item.value),
                    done: item.done
                };
            }
        };
    }
};
