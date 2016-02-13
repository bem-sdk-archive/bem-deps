/**
 *
 */
export default class BemImplementSet {
    constructor(iterable) {
        this._map = new Map();

        if (iterable) {
            for (let item of iterable) {
                this.add(item);
            }
        }
    }
    get size() {
        return this._map.size;
    }
    add(implement) {
        var id = implement.id;

        if (!this._map.has(id)) {
            this._map.set(id, implement);
        }

        return this;
    }
    clear() {
        this._map.clear();
    }
    delete(implement) {
        return this._map.delete(implement.id);
    }
    entries() {
        return this._map.values();
    }
    forEach(callbackFn, thisArg) {
        this._map.forEach(function(value) {
            callbackFn(value, value, this);
        }, thisArg);
    }
    has(entity) {
        return this._map.has(entity.id);
    }
    keys() {
        return this._map.values();
    }
    values() {
        return this._map.values();
    }
    [Symbol.iterator]() {
        return this._map.values();
    }
}
