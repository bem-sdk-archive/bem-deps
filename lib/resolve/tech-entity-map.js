import { stringify as stringifyEntity } from 'bem-naming';

/**
 *
 */
export default class TechEntityMap {
    constructor() {
        // It is necessary to dispense entities by tech.
        //
        // {String} key — technology name
        // {Set<String>} values — set of entity ids
        this._techSets = new Map();

        // It is necessary to store entity ids in `Set` instead of entity objects.
        //
        // {String} key — id
        // {Object} value — entity
        this._entities = new Map();
    }
    /**
     * Adds entity to set by technology.
     *
     * @param {String} tech
     * @param {Object} entity
     */
    add(tech, entity) {
        var id = stringifyEntity(entity);

        // Add new entitiy group with new tech.
        if (!this._techSets.has(tech)) {
            this._techSets.set(tech, new Set());
        }

        // Add entity to tech group.
        this._techSets.get(tech).add(id);
        this._entities.set(id, entity);
    }
    /**
     * Returns array where each item is entity set of same technology.
     *
     * @returns {{tech: String, entities: Object[]}[]}
     */
    toArray() {
        var arr = [];

        for (let [tech, ids] of this._techSets) {
            arr.push({
                tech: tech,
                entities: Array.from(ids).map(id => this._entities.get(id))
            });
        }

        return arr;
    }
}
