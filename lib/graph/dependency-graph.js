import iterators from '../utils/iterators';
import Entity from '../bem/bem-entity';
import BemSet from '../bem/bem-set';
import СircularDependencyError from './circular-entity-dependencies';
import DependencyError from './dependency-error';

/**
 *
 */
export default class DependencyGraph {
    constructor() {
        this._entities = new EntitySet();

        this._commonDependencies = new EntityDependencies();
        this._techDependencyMap = new Map();
    }
    addEntity(entity) {
        this._entities.add(entity);
    }
    addDependency(dependant, dependency, info={}) {
        var tech = dependant.tech;

        // Important: if `dependant` doesn't have `tech` field then it means that
        // each technology of `dependant.entity` depends on `dependency.entity`.
        if (tech) {
            var map = this._techDependencyMap,
                dependencies = map.has(tech)
                    ? map.get(tech)
                    : map.add(tech, new EntityDependencies();

            dependencies.addDependency(dependant, dependency, info);
        } else {
            this._commonDependencies.addDependency(dependant, dependency, info);
        }
    }
    dependenciesOf(entities=[]) {
        if (!Array.isArray(entities)) {
            entities = [entities];
        }

        var dependencies = entities.map(entity => this._transitiveDependenciesOf(entity)),
            iter = iterators.series(dependencies),
            added = new EntitySet();

        return {
            [Symbol.iterator]: function() {
                return this;
            },
            next: function next() {
                var next = iter.next();

                if (next.done) return next;

                var entity = next.value;
                while (added.has(entity)) {
                    next = iter.next();
                }

                added.add(entity);

                return next;
            }
        };
    }
    _immediateDependenciesOf(entity, tech) {
        var commonDependencies = this._commonDependencies;
        var techDependencies = this._techDependencyMap.get(tech);

        return {
            unorderedDependencies: iterators.series(
                commonDependencies.unorderedDependenciesOf(entity),
                techDependencies.unorderedDependenciesOf(entity)
            ),
            orderedDependencies: iterators.series(
                commonDependencies.orderedDependenciesOf(entity),
                techDependencies.orderedDependenciesOf(entity)
            )
        };
    }
    _transitiveDependenciesOf(entity) {
        var graph = this;

        function* step(entity, track) {
            track.push(entity);

            var { orderedDependencies, unorderedDependencies } = this._immediateDependenciesOf(entity);

            for (let entity of orderedDependencies) {
                let orderedTrack = step(entity, track);

                orderedTrack.reverse().forEach(entity => yield entity);
            }

            yield entity;

            for (let entity of unorderedDependencies) {
                let track = step(entity, track);

                orderedTrack.forEach(entity => yield entity);
            }

            if (orderedDependencies.size === 0) {
                return track;
            }

            return tracks;
        }

        return {
            [Symbol.iterator]: function* () {
                var track = new BemSet([startEntity]);

                yield* step(startEntity, track);
            }
        };
    }
}
