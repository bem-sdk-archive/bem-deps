import BemSet from '../bem/bem-set';
import iterators from '../utils/iterators';

/**
 *
 */
export default class DependencyMap {
    constructor() {
        this._unorderedDependencies = new Map();
        this._orderedDependencies  = new Map();
    }
    orderedDependenciesOf(entity) {
        return this._orderedDependencies.get(entity.id) || new Set();
    }
    unorderedDependenciesOf(entity) {
        return this._unorderedDependencies.get(entity.id) || new Set();
    }
    dependenciesOf(entity) {
        return iterators.series(
            this.orderedDependenciesOf(entity),
            this.unorderedDependenciesOf(entity)
        );
    }
    /**
     * @param {BemEntity} entity
     * @param {BemEntityTech} dependency
     * @param {Object} dependency
     */
    addDependency(entity, dependency, info={}) {
        const map = info.ordered ? this._orderedDependencies : this._unorderedDependencies;
        const key = entity.id;
        const dependencies = map.has(key)
            ? map.get(key)
            : map.set(key, new BemSet())
                .get(key);

        dependencies.add(dependency);
    }
}
