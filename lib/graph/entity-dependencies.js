import BemSet from '../bem-set';

/**
 *
 */
export default class EntityDependencies {
    constructor() {
        this._unoderedDependencies = new Map();
        this._orderedDependencies  = new Map();
    }
    unorderedDependenciesOf(entity) {
        return this._unorderedDependencies.get(entity.toString());
    }
    orderedDependenciesOf(entity) {
        return this._orderedDependencies.get(entity.toString());
    }
    addDependency(entity, dependency, info={}) {
        const map = info.ordered ? this._orderedDependencies : this._unoderedDependencies;
        const key = entity.id;
        const dependencies = map.has(key)
            ? map.get(key)
            : map.add(key, new BemSet();

        dependencies.add(dependency);
    }
}
