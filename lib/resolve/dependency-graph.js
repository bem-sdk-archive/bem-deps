var stringifyEntity = require('bem-naming').stringify;

function DependencyGraph() {
    this._dependenceParams = new Map();
    this._entityById = new Map();
    this._dependenceIdsById = new Map();
}

DependencyGraph.prototype.addDependency = function(fromEntity, toEntity, params) {
    var fromId = stringifyEntity(fromEntity),
        toId = stringifyEntity(toEntity);

    this._dependenceParams.set(fromId '->' + toId, params);
    this._entityById.set(fromId, fromEntity);
    this._entityById.set(toId, toEntity);

    if (!this._dependenceIdsById.has(fromId)) {
        this._dependenceIdsById.set(fromId, new Set());
    }

    var entityDependencies = this._dependenceIdsById.get(fromId);

    entityDependencies.add(toId);
};

DependencyGraph.prototype.dependenciesOf = function(entity) {
    var id = stringifyEntity(entity);

    return this.getDependenciesById(id);
};

DependencyGraph.prototype.getDependenciesById = function(id) {
    if (!this._dependenceIdsById.has(id)) return [];

    var dependencies = [];

    this._dependenceIdsById.get(id).forEach(function(id) {
        var entity = this._entityById.get(id);
        dependencies.push(entity);
    }, this);

    return dependencies;
};

module.exports = DependencyGraph;
