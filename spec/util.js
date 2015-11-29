var stringifyEntity = require('bem-naming').stringify,
    _ = require('lodash');

exports.findIndex = function (entities, entity) {
    if (typeof entity === 'function') {
        return _.findIndex(entities, entity);
    }

    var id = stringifyEntity(entity);

    return _.findIndex(entities, function (entity) {
        return stringifyEntity(entity) === id;
    });
};

exports.findLastIndex = function (entities, entity) {
    if (typeof entity === 'function') {
        return _.findIndex(entities, entity);
    }

    var id = stringifyEntity(entity);

    return _.findLastIndex(entities, function (entity) {
        return stringifyEntity(entity) === id;
    });
};
