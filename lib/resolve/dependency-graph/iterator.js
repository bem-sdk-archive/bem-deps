import { stringify as stringifyEntity } from 'bem-naming';
import DependencyError from './dependency-error';

export default class DependencyGraphIterator {
    constructor(graph, startEntity) {
        this._graph = graph;
        this._startEntity = startEntity;
    }
    *next() {
        function* step(track) {
            var previousId = track[track.length - 1];

            var orderedDependencies = this._graph.orderedDependencyMap.get(previousId),
                unorderedDependencies = this._graph.unorderedDependencyMap.get(previousId);

            for (let entity of orderedDependencies) {
                var id = stringifyEntity(entity);

                // игнорируем зависимость самого на себя
                if (previousId === id) {
                    return;
                }

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

                yield [entity, id, true];

                yield step(track.concat(id));
            }

            for (let entity of unorderedDependencies) {
                var entity = dependency.entity,
                    id = stringifyEntity(entity);

                // игнорируем зависимость самого на себя
                if (previousId === id) {
                    return;
                }

                yield [entity, id, undefined];

                yield step([id]);
            }
        };

        yield step([this._startEntity]);
    }
};
