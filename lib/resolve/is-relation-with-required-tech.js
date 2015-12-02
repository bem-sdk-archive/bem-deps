module.exports = function(relation, requiredTech) {
    if (!requiredTech || !relation.tech) return true;

    return relation.tech === requiredTech;
};
