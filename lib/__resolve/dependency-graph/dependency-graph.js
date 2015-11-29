var stringifyEntity = require('bem-naming').stringify;

function DependencyGraph() {
    this._hash = {};
}

DependencyGraph.prototype.addDependency = function(entity, dependencyEntity) {
    var key = stringifyEntity(entity),
        dependencies = this._hash[key];

    if (!dependencies) {
        dependencies = this._hash[key] = [];
    }

    dependencies.push(dependencyEntity);
};

DependencyGraph.prototype.dependenciesOf = function(entity) {
    var key = stringifyEntity(entity);

    return this._hash[key];
};

module.exports = DependencyGraph;
