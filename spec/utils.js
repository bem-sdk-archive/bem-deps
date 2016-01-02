import { stringify as stringifyEntity, typeOf as typeOfEntity } from 'bem-naming';
import _ from 'lodash';

exports.findIndex = function (entities, entity) {
    if (typeof entity !== 'object' || !typeOfEntity(entity)) {
        return -1;
    }

    var id = stringifyEntity(entity),
        firstIndex = -1,
        length = entities.length;

    for (let i = 0; i < length; ++i) {
        let entity = entities[i];

        if (typeof entity === 'object' && typeOfEntity(entity) && stringifyEntity(entity) === id) {
            firstIndex = i;
            break;
        }
    }

    return firstIndex;
};

exports.findLastIndex = function (entities, entity) {
    if (typeof entity !== 'object' || !typeOfEntity(entity)) {
        return -1;
    }

    var id = stringifyEntity(entity),
        lastIndex = -1,
        length = entities.length;

    for (let i = length - 1; i >= 0; --i) {
        let entity = entities[i];

        if (typeof entity === 'object' && typeOfEntity(entity) && stringifyEntity(entity) === id) {
            lastIndex = i;
            break;
        }
    }

    return lastIndex;
};
