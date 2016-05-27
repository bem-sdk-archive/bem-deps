'use strict';

const hashSet = require('hash-set');

const VertexSet = require('./vertex-set');

module.exports = class DirectedGraph {
    constructor() {
        this._vertices = new VertexSet();
        this._edgeMap = new Map();
    }
    addVertex(vertex) {
        this._vertices.add(vertex);

        return this;
    }
    addEdge(from, to) {
        this._directSuccessors(from).add(to);

        return this.addVertex(from).addVertex(to);
    }
    getDirectSuccessors(vertex) {
        return this._edgeMap.get(vertex.id);
    }
    _directSuccessors(vertex) {
        const successors = this.getDirectSuccessors(vertex);

        if (successors) {
            return successors;
        }

        const emptySet = new VertexSet();

        this._edgeMap.set(vertex.id, emptySet);

        return emptySet;
    }
}
