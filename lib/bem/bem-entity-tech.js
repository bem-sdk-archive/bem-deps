import BemEntity from './bem-entity';

/**
 *
 */
export default class BemEntityTech {
    constructor(obj) {
        const entity = obj.entity;

        this._obj = entity instanceof BemEntity
            ? obj
            : Object.assign({}, obj, { entity: new BemEntity(entity) });
    }

    get entity() { return this._obj.entity; }
    get tech()   { return this._obj.tech;   }

    get id() { return this._id || (this._id = this._buildId()); }
    _buildId() {
        if (!this.tech) return this.entity.id;

        return `${this.entity}.${this.tech}`;
    }

    toString() { return this.id; }
    valueOf() {
        return Object.assign({}, this._obj, { entity: this.entity.valueOf() });
    }
    is(obj) {
        return obj && (this.id === obj.id);
    }
}
