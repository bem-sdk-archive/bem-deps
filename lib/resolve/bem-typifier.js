var bemNaming = require('bem-naming'),
    stringifyEntity = bemNaming.stringify,
    entityType = bemNaming.typeOf;

export default class BemTypifier {
    constructor() {
        this._entityMap = new Map();

        this._typedIds = {
            block: new Set(),
            blockMod: new Set(),

            elem: new Set(),
            elemMod: new Set()
        };
    }
    typify(entity) {
        var id = stringifyEntity(entity),
            type = entityType(entity);

        this._entityMap.set(id, entity);
        this._typedIds[type].add(id);
    }
    blocks() {
        return this._getEntitiesByType('block');
    }
    blockModificators() {
        return this._getEntitiesByType('blockMod');
    }
    elements() {
        return this._getEntitiesByType('elem');
    }
    elementModificators() {
        return this._getEntitiesByType('elemMod');
    }
    _entitiesByType(type) {
        var entities = [],
            iterator = this._typedIds[type].values();

        return {
            next: function () {
                var item = iterator.next();

                return {
                    value: this._entityMap.get(item.value),
                    done: item.done
                };
            }
        };
    }
}
