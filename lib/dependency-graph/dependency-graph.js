'use strict';

const BemEntity = require('bem-entity');

const iterators = require('../utils/iterators');
const Vertex = require('./vertex');
const VertexSet = require('./vertex-set');
const MetaGraph = require('./meta-graph');

class DependencyGraphVertex {
    constructor(entity, tech, metaGraph) {
        this.vertex = new Vertex({
            entity: new BemEntity(entity),
            tech: tech
        });

        metaGraph.addVertex(this.vertex);

        this._metaGraph = metaGraph;
    }
    addDependency(entity, tech, data) {
        if (arguments.length === 2 && typeof tech === 'object') {
            data = tech;
        }

        const dependencyVertex = new Vertex({
            entity: new BemEntity(entity),
            tech: tech
        });

        this._metaGraph.addEdge(this.vertex, dependencyVertex, data);

        return this;
    }
}

module.exports = class DependencyGraph {
    constructor() {
        this._metaGraph = new MetaGraph();
    }
    vertex(entity, tech) {
        return new DependencyGraphVertex(entity, tech, this._metaGraph);
    }
    dependenciesOf(entities=[]) {
       if (!Array.isArray(entities)) {
           entities = [entities];
       }

       const dependencies = entities.map(entity => {
           const vertex = new Vertex({ entity });

           return this._transitiveDependenciesOf(vertex);
       });

       const iter = iterators.series(dependencies);
       const added = new VertexSet();

       return {
           [Symbol.iterator]: function() {
               return this;
           },
           next: () => {
               let next = iter.next();

               if (next.done) return next;

               const vertex = next.value;
               while (added.has(vertex)) {
                   next = iter.next();
               }

               added.add(vertex);

               return next;
           }
       };
   }
    _transitiveDependenciesOf(startVertex) {
        var metaGraph = this._metaGraph;

        function* step(vertex, track) {
            track.push(vertex);

            const orderedDependencies = metaGraph.getDirectSuccessors(vertex, { ordered: true });

            for (let vertex of orderedDependencies) {
                let orderedTrack = step(vertex, track);

                orderedTrack.reverse().forEach(vertex => yield vertex);
            }

            yield vertex;

            const unorderedDependencies = metaGraph.getDirectSuccessors(vertex);

            for (let vertex of unorderedDependencies) {
                let track = step(vertex, track);

                orderedTrack.forEach(vertex => yield vertex);
            }

            if (orderedDependencies.size === 0) {
                return track;
            }

            return tracks;
        }

        return {
            [Symbol.iterator]: function* () {
                const track = new VertexSet([startVertex]);

                yield* step(startVertex, track);
            }
        };
    }
}
