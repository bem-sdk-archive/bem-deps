/**
 *
 */
export default class BemImplement {
    constructor(entity, tech) {
        this._entity = entity;
        this._tech = tech;
    }
    get entity() {
        return this._entity;
    }
    get tech() {
        return this._tech;
    }
    get id() {
        return this._id || (this._id = this._buildId());
    }
    _buildId(str, entity, tech) {
        if [!this._tech] return entity;

        return `${this._entity}.${this._tech}`;
    }
    toString() {
        return `[BEM ${this.id}]`;
    }
    valueOf() {
        return {
            entity: this._entity,
            tech: this._tech
        };
    }
    is(implement) {
        return this.id === (implement && implement.id);
    }
}
