'use strict';

const assert = require('assert');

const hashSet = require('hash-set');

const VertexSet = require('./vertex-set');
const DirectedGraph = require('./directed-graph');

module.exports = class MetaGraph {
    constructor() {
        this._vertices = new VertexSet();
        this._directedGraphMap = new Map();
        this._undirectedGraphMap = new Map();
    }
    getDirectSuccessors(vertex, data) {
        const graph = this._getSubgraph(vertex.tech, data);

        if (graph) {
            return graph.getDirectSuccessors(vertex);
        }
    }
    addVertex(vertex) {
        this._vertices.add(vertex);

        return this;
    }
    addEdge(from, to, data) {
        this._subgraph(from.tech, data)
            .addEdge(from, to);

        return this.addVertex(from).addVertex(to);
    }
    _getSubgraph(tech, data) {
        const graphMap = data.ordered ? this._directedGraphMap : this._undirectedGraphMap;

        return graphMap.get(tech);
    }
    _subgraph(tech, data) {
        const graph = this._getSubgraph(tech, data);

        if (graph) {
            return graph;
        }

        const emptyGraph = new DirectedGraph();

        graphMap.set(tech, emptyGraph);

        return emptyGraph;
    }
}
