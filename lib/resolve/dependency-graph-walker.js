var stringifyEntity = require('bem-naming').stringify;

function DependencyGraphWalker(dependencyGraph) {
    this._graph = dependencyGraph;
    this._visitedIds = {};
}

DependencyGraphWalker.prototype.walkFrom = function(entity) {
    var id = stringifyEntity(entity),
        track = [id],
        orderedDependenceEntities = [],
        unorderedDependenceEntities = [];

    this._step(track, orderedDependenceEntities, unorderedDependenceEntities);

    return {
        orderedDependenceEntities: orderedDependenceEntities,
        unorderedDependenceEntities: unorderedDependenceEntities
    };
}

DependencyGraphWalker.prototype._markAsVisited = function(entityId) {
    this._visitedIds[entityId] = true;
};

DependencyGraphWalker.prototype._isVisited = function(entityId) {
    return Boolean(this._visitedIds[entityId]);
};

DependencyGraphWalker.prototype._step = function(track, orderedDependenceEntities, unorderedDependenceEntities) {
    var previousId = track[track.length - 1];

    if (this._isVisited(previousId)) return;

    this._markAsVisited(previousId);

    var dependenciesOfPreviousEntity = this._graph.dependenciesOf(previousId);

    if (dependenciesOfPreviousEntity) {
        dependenciesOfPreviousEntity.forEach(function (dependency) {
            var entity = dependency.entity,
                id = stringifyEntity(entity);

            // игнорируем зависимость самого на себя
            if (previousId === id) {
                return;
            }

            if (dependency.order === 'dependenceBeforeDependants') {
                // проверяем нет ли циклической ordered-зависимости
                var loopFirstIndex = track.indexOf(id);
                if (loopFirstIndex !== -1) {
                    // добавляем в цепь замыкающую сущность
                    track.push(id);

                    // формируем цепь для ошибки
                    var errorInfo = track.slice(loopFirstIndex).map(function (key) {
                        return {
                            entity: parseId(key)
                        };
                    });

                    throw new DependencyError(errorInfo);
                }

                orderedDependenceEntities.unshift(entity);

                return step(track.concat(id), orderedDependenceEntities, unorderedDependenceEntities);
            } else {
                unorderedDependenceEntities.push(entity);

                return step([id], orderedDependenceEntities, unorderedDependenceEntities);
            }
        });
    }
};

module.exports = DependencyGraphWalker;
