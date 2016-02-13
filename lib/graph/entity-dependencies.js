import BemEntitySet from '../bem-implement-set';
import BemImplementSet from '../bem-implement-set';

/**
 *
 */
export default class EntityDependencies {
    constructor() {
        this._unoderedDependencies = new Map();
        this._orderedDependencies = new Map();
    }
    unorderedDependenciesOf(entity) {
        return this._orderedDependencies.get(entity.id);
    }
    orderedDependenciesOf(entity) {
        return this._orderedDependencies.get(entity.id);
    }
    addDependency(entity, dependency, info={}) {
        var map = info.ordered ? this._orderedDependencies : this._unoderedDependencies,
            key = entity.id,
            dependencies = map.has(key)
                ? map.get(key)
                : map.add(key, new BemImplementSet();

        dependencies.add(dependency);
    }
}
