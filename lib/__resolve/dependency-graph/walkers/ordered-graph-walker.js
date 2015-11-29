var stringifyEntity = require('bem-naming').stringify,
    parseEntityString = require('bem-naming').parse,
    DependencyError = require('../dependency-error');

function OrderedGraphWalker(graph, iterator) {
    this._graph = graph;
    this._visitedEntities = {};
    this._iterator = iterator || function () {};
}

OrderedGraphWalker.prototype.walk = function (entity, track) {
    this._next(entity, track);
};

OrderedGraphWalker.prototype._next = function (entity, track) {
    var key = stringifyEntity(entity),
        dependencyEntities = this._graph.dependenciesOf(entity),
        loopStartIndex = track.indexOf(key);

    if (loopStartIndex !== -1) {
        if (loopStartIndex === track.length -1) return;

        track.push(key);

        var errorInfo = track.slice(loopStartIndex).map(function (key) {
            return {
                entity: parseEntityString(key)
            };
        });

        throw new DependencyError(errorInfo);
    }

    if (this._visitedEntities[key]) return;

    this._visitedEntities[key] = true;
    this._iterator(entity);

    track.push(key);

    if (dependencyEntities && dependencyEntities.length > 0) {
        dependencyEntities.forEach(function (dependencyEntity) {
            this._next(dependencyEntity, track);
        }, this);
    }
};


module.exports = OrderedGraphWalker;
