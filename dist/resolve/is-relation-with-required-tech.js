"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isRelationWithRequiredTech;
function isRelationWithRequiredTech(relation, requiredTech) {
    if (!relation.tech) return true;

    return relation.tech === requiredTech;
};