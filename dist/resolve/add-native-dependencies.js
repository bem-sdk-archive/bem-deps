'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = addNativeDependencies;

var _bemNaming = require('bem-naming');

var _bemTypifier = require('./bem-typifier');

var _bemTypifier2 = _interopRequireDefault(_bemTypifier);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function addNativeDependencies(declaration, dependencyGraph) {
    var bemTypifier = new _bemTypifier2.default();

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
        for (var _iterator = dependencyGraph.entities()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var entity = _step.value;

            bemTypifier.typify(entity);
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

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
        for (var _iterator2 = declaration[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _entity = _step2.value;

            bemTypifier.typify(_entity);
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

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
        for (var _iterator3 = bemTypifier.blockModificators()[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
            var modifier = _step3.value;

            var modifierId = (0, _bemNaming.stringify)(modifier),
                blockId = modifier.block,
                block = { block: blockId };

            if (!bemTypifier._entityMap.has(blockId)) continue;

            var hasOrderedDependency = false;

            var _iteratorNormalCompletion9 = true;
            var _didIteratorError9 = false;
            var _iteratorError9 = undefined;

            try {
                for (var _iterator9 = dependencyGraph.orderedDependenciesOf(block)[Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
                    var blockDependency = _step9.value;

                    if ((0, _bemNaming.stringify)(blockDependency) === modifierId) {
                        hasOrderedDependency = true;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError9 = true;
                _iteratorError9 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                        _iterator9.return();
                    }
                } finally {
                    if (_didIteratorError9) {
                        throw _iteratorError9;
                    }
                }
            }

            if (!hasOrderedDependency) {
                dependencyGraph.addDependency(modifier, block, { order: 'blockBeforeBlockModifier' });
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

    var _iteratorNormalCompletion4 = true;
    var _didIteratorError4 = false;
    var _iteratorError4 = undefined;

    try {
        for (var _iterator4 = bemTypifier.blockModificators()[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
            var booleanModifier = _step4.value;

            if (booleanModifier.modVal === true) {
                var block = booleanModifier.block,
                    modName = booleanModifier.modName,
                    ignoreVals = [];

                var _iteratorNormalCompletion10 = true;
                var _didIteratorError10 = false;
                var _iteratorError10 = undefined;

                try {
                    for (var _iterator10 = dependencyGraph.orderedDependenciesOf(booleanModifier)[Symbol.iterator](), _step10; !(_iteratorNormalCompletion10 = (_step10 = _iterator10.next()).done); _iteratorNormalCompletion10 = true) {
                        var modifierDependency = _step10.value;

                        if (modifierDependency.block === block && modifierDependency.modName === modName) {
                            ignoreVals.push(modifierDependency.modVal);
                        }
                    }
                } catch (err) {
                    _didIteratorError10 = true;
                    _iteratorError10 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion10 && _iterator10.return) {
                            _iterator10.return();
                        }
                    } finally {
                        if (_didIteratorError10) {
                            throw _iteratorError10;
                        }
                    }
                }

                var _iteratorNormalCompletion11 = true;
                var _didIteratorError11 = false;
                var _iteratorError11 = undefined;

                try {
                    for (var _iterator11 = bemTypifier.blockModificators()[Symbol.iterator](), _step11; !(_iteratorNormalCompletion11 = (_step11 = _iterator11.next()).done); _iteratorNormalCompletion11 = true) {
                        var _modifier = _step11.value;

                        if (_modifier.block === block && _modifier.modName === modName && ignoreVals.indexOf(_modifier.modVal) === -1 && _modifier.modVal !== true) {
                            dependencyGraph.addDependency(_modifier, booleanModifier, { order: 'blockBooleanModifierBeforeBlockModifier' });
                        }
                    }
                } catch (err) {
                    _didIteratorError11 = true;
                    _iteratorError11 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion11 && _iterator11.return) {
                            _iterator11.return();
                        }
                    } finally {
                        if (_didIteratorError11) {
                            throw _iteratorError11;
                        }
                    }
                }
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
        for (var _iterator5 = bemTypifier.elementModificators()[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
            var _modifier2 = _step5.value;

            var modifierId = (0, _bemNaming.stringify)(_modifier2),
                element = { block: _modifier2.block, elem: _modifier2.elem },
                elementId = (0, _bemNaming.stringify)(element);

            if (!bemTypifier._entityMap.has(elementId)) continue;

            var hasOrderedDependency = false;

            var _iteratorNormalCompletion12 = true;
            var _didIteratorError12 = false;
            var _iteratorError12 = undefined;

            try {
                for (var _iterator12 = dependencyGraph.orderedDependenciesOf(element)[Symbol.iterator](), _step12; !(_iteratorNormalCompletion12 = (_step12 = _iterator12.next()).done); _iteratorNormalCompletion12 = true) {
                    var elementDependency = _step12.value;

                    if ((0, _bemNaming.stringify)(elementDependency) === modifierId) {
                        hasOrderedDependency = true;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError12 = true;
                _iteratorError12 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion12 && _iterator12.return) {
                        _iterator12.return();
                    }
                } finally {
                    if (_didIteratorError12) {
                        throw _iteratorError12;
                    }
                }
            }

            if (!hasOrderedDependency) {
                dependencyGraph.addDependency(_modifier2, element, { order: 'elementBeforeElementModifier' });
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

    var _iteratorNormalCompletion6 = true;
    var _didIteratorError6 = false;
    var _iteratorError6 = undefined;

    try {
        for (var _iterator6 = bemTypifier.elementModificators()[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
            var _booleanModifier = _step6.value;

            if (_booleanModifier.modVal === true) {
                var block = _booleanModifier.block,
                    elem = _booleanModifier.elem,
                    modName = _booleanModifier.modName,
                    ignoreVals = [];

                var _iteratorNormalCompletion13 = true;
                var _didIteratorError13 = false;
                var _iteratorError13 = undefined;

                try {
                    for (var _iterator13 = dependencyGraph.orderedDependenciesOf(_booleanModifier)[Symbol.iterator](), _step13; !(_iteratorNormalCompletion13 = (_step13 = _iterator13.next()).done); _iteratorNormalCompletion13 = true) {
                        var _modifierDependency = _step13.value;

                        if (_modifierDependency.block === block && elem && _modifierDependency.elem === elem && _modifierDependency.modName === modName) {
                            ignoreVals.push(_modifierDependency.modVal);
                        }
                    }
                } catch (err) {
                    _didIteratorError13 = true;
                    _iteratorError13 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion13 && _iterator13.return) {
                            _iterator13.return();
                        }
                    } finally {
                        if (_didIteratorError13) {
                            throw _iteratorError13;
                        }
                    }
                }

                var _iteratorNormalCompletion14 = true;
                var _didIteratorError14 = false;
                var _iteratorError14 = undefined;

                try {
                    for (var _iterator14 = bemTypifier.elementModificators()[Symbol.iterator](), _step14; !(_iteratorNormalCompletion14 = (_step14 = _iterator14.next()).done); _iteratorNormalCompletion14 = true) {
                        var _modifier3 = _step14.value;

                        if (_modifier3.block === block && elem && _modifier3.elem === elem && _modifier3.modName === modName && ignoreVals.indexOf(_modifier3.modVal) === -1 && _modifier3.modVal !== true) {
                            dependencyGraph.addDependency(_modifier3, _booleanModifier, { order: 'elementBooleanModifierBeforeElementModifier' });
                        }
                    }
                } catch (err) {
                    _didIteratorError14 = true;
                    _iteratorError14 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion14 && _iterator14.return) {
                            _iterator14.return();
                        }
                    } finally {
                        if (_didIteratorError14) {
                            throw _iteratorError14;
                        }
                    }
                }
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

    var _iteratorNormalCompletion7 = true;
    var _didIteratorError7 = false;
    var _iteratorError7 = undefined;

    try {
        for (var _iterator7 = bemTypifier.elementModificators()[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
            var _modifier4 = _step7.value;

            var modifierId = (0, _bemNaming.stringify)(_modifier4),
                blockId = _modifier4.block,
                block = { block: blockId };

            if (!bemTypifier._entityMap.has(blockId)) continue;

            var hasOrderedDependency = false;

            var _iteratorNormalCompletion15 = true;
            var _didIteratorError15 = false;
            var _iteratorError15 = undefined;

            try {
                for (var _iterator15 = dependencyGraph.orderedDependenciesOf(block)[Symbol.iterator](), _step15; !(_iteratorNormalCompletion15 = (_step15 = _iterator15.next()).done); _iteratorNormalCompletion15 = true) {
                    var _blockDependency = _step15.value;

                    if ((0, _bemNaming.stringify)(_blockDependency) === modifierId) {
                        hasOrderedDependency = true;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError15 = true;
                _iteratorError15 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion15 && _iterator15.return) {
                        _iterator15.return();
                    }
                } finally {
                    if (_didIteratorError15) {
                        throw _iteratorError15;
                    }
                }
            }

            if (!hasOrderedDependency) {
                dependencyGraph.addDependency(_modifier4, block, { order: 'blockBeforeElementModifier' });
            }
        }
    } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion7 && _iterator7.return) {
                _iterator7.return();
            }
        } finally {
            if (_didIteratorError7) {
                throw _iteratorError7;
            }
        }
    }

    var _iteratorNormalCompletion8 = true;
    var _didIteratorError8 = false;
    var _iteratorError8 = undefined;

    try {
        for (var _iterator8 = bemTypifier.elements()[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
            var _element = _step8.value;

            var elementId = (0, _bemNaming.stringify)(_element),
                blockId = _element.block,
                block = { block: blockId };

            if (!bemTypifier._entityMap.has(blockId)) continue;

            var hasOrderedDependency = false;

            var _iteratorNormalCompletion16 = true;
            var _didIteratorError16 = false;
            var _iteratorError16 = undefined;

            try {
                for (var _iterator16 = dependencyGraph.orderedDependenciesOf(block)[Symbol.iterator](), _step16; !(_iteratorNormalCompletion16 = (_step16 = _iterator16.next()).done); _iteratorNormalCompletion16 = true) {
                    var _blockDependency2 = _step16.value;

                    if ((0, _bemNaming.stringify)(_blockDependency2) === elementId) {
                        hasOrderedDependency = true;
                        break;
                    }
                }
            } catch (err) {
                _didIteratorError16 = true;
                _iteratorError16 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion16 && _iterator16.return) {
                        _iterator16.return();
                    }
                } finally {
                    if (_didIteratorError16) {
                        throw _iteratorError16;
                    }
                }
            }

            if (!hasOrderedDependency) {
                dependencyGraph.addDependency(_element, block, { order: 'blockBeforeElement' });
            }
        }
    } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
    } finally {
        try {
            if (!_iteratorNormalCompletion8 && _iterator8.return) {
                _iterator8.return();
            }
        } finally {
            if (_didIteratorError8) {
                throw _iteratorError8;
            }
        }
    }
};