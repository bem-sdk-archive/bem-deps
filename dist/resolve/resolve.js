'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = resolve;

var _bemNaming = require('bem-naming');

var _dependencyGraph = require('./dependency-graph');

var _dependencyGraph2 = _interopRequireDefault(_dependencyGraph);

var _addNativeDependencies = require('./add-native-dependencies');

var _addNativeDependencies2 = _interopRequireDefault(_addNativeDependencies);

var _isRelationWithRequiredTech = require('./is-relation-with-required-tech');

var _isRelationWithRequiredTech2 = _interopRequireDefault(_isRelationWithRequiredTech);

var _isDeclarationDependency = require('./is-declaration-dependency');

var _isDeclarationDependency2 = _interopRequireDefault(_isDeclarationDependency);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function resolve(declaration, relations, options) {
    var requiredTech = options.tech,
        dependencyGraph = new _dependencyGraph2.default(),
        dependenceEntityById = new Map(),
        dependenceEntitiesByTech = new Map();

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = relations[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var relation = _step.value;

            if (!(0, _isRelationWithRequiredTech2.default)(relation, requiredTech)) continue;

            var _iteratorNormalCompletion3 = true;
            var _didIteratorError3 = false;
            var _iteratorError3 = undefined;

            try {
                for (var _iterator3 = relation.dependOn[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                    var dependency = _step3.value;

                    if ((0, _isDeclarationDependency2.default)(relation.tech, dependency.tech, requiredTech)) {
                        addDeclarationDependency(dependency);
                    } else {
                        dependencyGraph.addDependency(relation.entity, dependency.entity, { order: dependency.order });
                    }
                }
            } catch (err) {
                _didIteratorError3 = true;
                _iteratorError3 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
            }
        } finally {
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }

    function addDeclarationDependency(dependency) {
        var tech = dependency.tech,
            id = (0, _bemNaming.stringify)(dependency.entity);

        if (!dependenceEntitiesByTech.has(tech)) {
            dependenceEntitiesByTech.set(tech, new Set());
        }

        dependenceEntitiesByTech.get(tech).add(id);
        dependenceEntityById.set(id, dependency.entity);
    }

    var declarationDependOn = [];
    dependenceEntitiesByTech.forEach(function (dependenceEntities, tech) {
        declarationDependOn.push({
            tech: tech,
            entities: Array.from(dependenceEntities).map(function (id) {
                return dependenceEntityById.get(id);
            })
        });
    });

    (0, _addNativeDependencies2.default)(declaration, dependencyGraph);

    var visitedIds = new Set(),
        addedIds = new Set(),
        resolvedDeclaration = [];

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = declaration[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var declarationEntity = _step2.value;

            var beforeEntities = [],
                afterEntities = [];

            var _iteratorNormalCompletion4 = true;
            var _didIteratorError4 = false;
            var _iteratorError4 = undefined;

            try {
                for (var _iterator4 = dependencyGraph.entitiesFrom(declarationEntity)[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                    var _step4$value = _slicedToArray(_step4.value, 3);

                    var dependenceEntity = _step4$value[0];
                    var entityId = _step4$value[1];
                    var order = _step4$value[2];

                    if (visitedIds.has(entityId)) continue;

                    visitedIds.add(entityId);

                    if (order) {
                        beforeEntities.unshift(dependenceEntity);
                    } else {
                        afterEntities.push(dependenceEntity);
                    }
                }
            } catch (err) {
                _didIteratorError4 = true;
                _iteratorError4 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            var _iteratorNormalCompletion5 = true;
            var _didIteratorError5 = false;
            var _iteratorError5 = undefined;

            try {
                for (var _iterator5 = beforeEntities[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                    var dependenceEntity = _step5.value;

                    var dependenceEntityId = (0, _bemNaming.stringify)(dependenceEntity);
                    if (!addedIds.has(dependenceEntityId)) {
                        resolvedDeclaration.push(dependenceEntity);
                        addedIds.add(dependenceEntityId);
                    }
                }
            } catch (err) {
                _didIteratorError5 = true;
                _iteratorError5 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            var declarationEntityId = (0, _bemNaming.stringify)(declarationEntity);
            if (!addedIds.has(declarationEntityId)) {
                resolvedDeclaration.push(declarationEntity);
                addedIds.add(declarationEntityId);
            }

            var _iteratorNormalCompletion6 = true;
            var _didIteratorError6 = false;
            var _iteratorError6 = undefined;

            try {
                for (var _iterator6 = afterEntities[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                    var dependenceEntity = _step6.value;

                    var dependenceEntityId = (0, _bemNaming.stringify)(dependenceEntity);
                    if (!addedIds.has(dependenceEntityId)) {
                        resolvedDeclaration.push(dependenceEntity);
                        addedIds.add(dependenceEntityId);
                    }
                }
            } catch (err) {
                _didIteratorError6 = true;
                _iteratorError6 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }
        }
    } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
            }
        } finally {
            if (_didIteratorError2) {
                throw _iteratorError2;
            }
        }
    }

    ;

    return {
        entities: resolvedDeclaration,
        dependOn: declarationDependOn
    };
};