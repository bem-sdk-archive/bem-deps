module.exports = function isRelation(obj) {
    return typeof obj === 'object' && !Array.isArray(obj) && obj.entity && obj.dependOn;
};
