import { stringify as stringifyEntity, typeOf as typeOfEntity } from 'bem-naming';

/**
 *
 */
export default class BemEntity {
    constructor(obj) {
        this._obj = obj;

        if (!obj.block) {
             throw new Error('This is not valid BEM entity: the field `block` is undefined.');
        }

        // нормализуем булевые модификаторы
        if (obj.modName && !obj.hasOwnProperty('modVal')) {
            // клонируем объект, чтобы не менять его
            this._obj = Object.assign({ modVal: true }, obj);
        }
    }

    get block()   { return this._obj.block;   }
    get elem()    { return this._obj.elem;    }
    get modName() { return this._obj.modName; }
    get modVal()  { return this._obj.modVal;  }

    get id()   { return this._id   || (this._id   = stringifyEntity(this._obj)); }
    get type() { return this._type || (this._type = typeOfEntity(this._obj));    }

    toString() { return this.id;   }
    valueOf()  { return this._obj; }

    is(entity) {
        return entity && (this.toString() === entity.toString());
    }
}
