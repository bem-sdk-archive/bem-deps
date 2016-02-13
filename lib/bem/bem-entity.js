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

        // TODO:
        Object.defineProperty(this, 'block', {
            get: () => this._obj.block
        });
        Object.defineProperty(this, 'elem', {
            get: () => this._obj.elem
        });
        Object.defineProperty(this, 'modName', {
            get: () => this._obj.modName
        });
        Object.defineProperty(this, 'modVal', {
            get: () => this._obj.modVal
        });
        Object.defineProperty(this, 'id', {
            get: () => this._id || (this._id = stringifyEntity(this._obj))
        });
        Object.defineProperty(this, 'type', {
            get: () => this._type || (this._type = typeOfEntity(this._obj))
        });
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
