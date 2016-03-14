"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = isDeclarationDependency;
function isDeclarationDependency(dependantTech, dependencyTech, requiredTech) {
    if (!requiredTech || !dependencyTech) return false;

    return dependantTech ? dependencyTech !== dependantTech : dependencyTech !== requiredTech;
};