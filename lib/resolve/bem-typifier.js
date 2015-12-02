var bemNaming = require('bem-naming'),
    stringifyEntity = bemNaming.stringify,
    entityType = bemNaming.typeOf;

function BemTypifier() {
    this._entityById = new Map();

    this._entityIdsByType = {
        block: new Set(),
        blockMod: new Set(),

        elem: new Set(),
        elemMod: new Set()
    };
};

BemTypifier.prototype.typify = function(entity) {
    var id = stringifyEntity(entity),
        type = entityType(entity);

    this._entityById.set(id, entity);
    this._entityIdsByType[type].add(id);
};

BemTypifier.prototype.getBlocks = function(id) {
    return this._getEntitiesByType('block');
};

BemTypifier.prototype.getBlockModificators = function() {
    return this._getEntitiesByType('blockMod');
};

BemTypifier.prototype.getElements = function() {
    return this._getEntitiesByType('elem');
};

BemTypifier.prototype.getElementModificators = function() {
    return this._getEntitiesByType('elemMod');
};

BemTypifier.prototype._getEntitiesByType = function(type) {
    var entities = [];

    this._entityIdsByType[type].forEach(function(id) {
        var entity = this._entityById.get(id);

        entities.push(entity);
    }, this);

    return entities;
};

module.exports = BemTypifier;
