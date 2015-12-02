var bemNaming = require('bem-naming'),
    stringifyEntity = bemNaming.stringify,
    entityType = bemNaming.typeOf;

function BemTypifier() {
    this._entitiesById = {};

    this._entityIdsByType = {
        block: new Set(),
        blockMod: new Set(),

        elems: new Set(),
        elemMod: new Set()
    };
};

BemTypifier.prototype.typify = function(entity) {
    var id = stringifyEntity(dependentEntity),
        type = entityType(dependentEntity);

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
    return this._entityIdsByType[type].map(function (id) {
        return this._getEntityById(id);
    }, this);
};

BemTypifier.prototype._getEntityById = function(id) {
    return this._entitiesById[id];
};

module.exports = BemTypifier;
