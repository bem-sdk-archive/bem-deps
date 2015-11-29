var stringifyEntity = require('bem-naming').stringify;

function UnorderedGraphWalker(graph, iterator) {
    this._graph = graph;
    this._visitedEntities = {};
    this._iterator = iterator;
}

UnorderedGraphWalker.prototype.walk = function (firstEntity) {
    this._next(firstEntity);
};

UnorderedGraphWalker.prototype._next = function (entity) {
    var key = stringifyEntity(entity),
        dependencyEntities = this._graph.dependenciesOf(entity);

    if (this._visitedEntities[key]) return;

    this._visitedEntities[key] = true;
    this._iterator(entity);

    if (dependencyEntities && dependencyEntities.length > 0) {
        dependencyEntities.forEach(function (dependencyEntity) {
            this._next(dependencyEntity);
        }, this);
    }
};

module.exports = UnorderedGraphWalker;
