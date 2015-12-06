export default function isRelationWithRequiredTech(relation, requiredTech) {
    if (!requiredTech || !relation.tech) return true;

    return relation.tech === requiredTech;
};
