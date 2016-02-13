export default function(uniqId) {
    return class ObjectSet {
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
        add(obj) {
            const id = uniqId(obj);

            if (!this._map.has(id)) {
                this._map.set(id, obj);
            }

            return this;
        }
        has(obj) {
            const id = uniqId(obj);

            return this._map.has(id);
        }
        delete(obj) {
            const id = uniqId(obj);

            return this._map.delete(id);
        }
        clear() {
            this._map.clear();
        }
        entries() {
            return this._map.values();
        }
        forEach(callbackFn, thisArg) {
            this._map.forEach(function(value) {
                callbackFn(value, value, this);
            }, thisArg);
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
        valueOf() {
            return new Set(this);
        }
        toString() {
            return this.valueOf().toString();
        }
    };
}
