import { stringify as stringifyEntity, typeOf as typeOfEntity } from 'bem-naming';

/**
 *
 */
export default class BemEntity {
    constructor(obj) {
        this._obj = obj;

        // если инстанс класса, то копируем закешированные значения свойств
        this._id = obj._id;
        this._type = obj._type;
    }
    get block() {
        return this._obj.block;
    }
    get elem() {
        return this._obj.elem;
    }
    get modName() {
        return this._obj.modName;
    }
    get modVal() {
        return this._obj.modVal;
    }
    get id() {
        return this._id || (this._id = stringifyEntity(this._obj));
    }
    get type() {
        return this._type || (this._type = typeOfEntity(this._obj));
    }
    toString() {
        return `[BEM ${this.id}]`;
    }
    valueOf() {
        return this._obj;
    }
    is(entity) {
        return this.id === (entity && entity.id);
    }
}
