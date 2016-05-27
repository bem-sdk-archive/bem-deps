'use strict';

const assert = require('assert');

const BemEntity = require('bem-entity');

module.exports = class Vertex {
    constructor(entity, tech) {
        assert(entity instanceof BemEntity);

        this.entity = entity;
        this.tech = tech;
        this.id = tech ? `${entity}.${tech}` : entity.id;
    }
    toString() {
        return this.id;
    }
    _buildId() {
        if (!this.tech) return this.entity.id;

        return `${this.entity}.${this.tech}`;
    }
};
