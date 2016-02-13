/**
 *
 */
export default class BemImplement {
    constructor(entity, tech) {
        this._entity = entity;
        this._tech = tech;

        // TODO:
        Object.defineProperty(this, 'entity', {
            get: () => this._obj._entity
        });
        Object.defineProperty(this, 'tech', {
            get: () => this._obj._tech
        });
        Object.defineProperty(this, 'id', {
            get: () => this._id || (this._id = this._buildId())
        });
    }
    _buildId() {
        if (!this._tech) return this._entity.id;

        return `${this._entity.id}.${this._tech}`;
    }
    toString() {
        return `[BEM ${this.id}]`;
    }
    valueOf() {
        var tech = this._tech;
        var obj = {
            entity: this._entity.valueOf()
        };

        tech && (obj.tech = tech);

        return obj;
    }
    is(implement) {
        return this.id === (implement && implement.id);
    }
}
