module.exports = function (entity1, entity2) {
    var l1 = Object.keys(entity1).length,
        l2 = Object.keys(entity2).length;

    if (entity1.modVal === true) {
        l1 -= 0.1;
    }

    if (entity2.modVal === true) {
        l2 -= 0.1;
    }

    return l1 - l2;
};
