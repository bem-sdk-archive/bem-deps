'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _bemNaming = require('bem-naming');

var _dependencyError = require('./dependency-error');

var _dependencyError2 = _interopRequireDefault(_dependencyError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DependencyGraph = function () {
    function DependencyGraph() {
        _classCallCheck(this, DependencyGraph);

        this._entityMap = new Map();
        this._dependencyMap = new Map();
        this._orderedDependencyMap = new Map();
        this._unorderedDependencyMap = new Map();
    }

    _createClass(DependencyGraph, [{
        key: 'addDependency',
        value: function addDependency(fromEntity, toEntity) {
            var params = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

            var fromId = (0, _bemNaming.stringify)(fromEntity),
                toId = (0, _bemNaming.stringify)(toEntity);

            this._entityMap.set(fromId, fromEntity);
            fromEntity.id = fromId; // TODO: fixme
            this._entityMap.set(toId, toEntity);
            toEntity.id = toId;

            var map = params.order ? this._orderedDependencyMap : this._unorderedDependencyMap;

            if (!map.has(fromId)) {
                map.set(fromId, new Set());
            }

            map.get(fromId).add(toId);
        }
    }, {
        key: 'entities',
        value: function entities() {
            return this._entityMap.values();
        }
    }, {
        key: 'entitiesFrom',
        value: function entitiesFrom(startEntity) {
            var graph = this,
                entityMap = this._entityMap,
                visitedIds = new Set();

            return _defineProperty({}, Symbol.iterator, regeneratorRuntime.mark(function _callee() {
                var _marked, step, startId;

                return regeneratorRuntime.wrap(function _callee$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                step = function step(track) {
                                    var previousId, orderedDependencies, unorderedDependencies, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, id, loopFirstIndex, errorInfo, _iteratorNormalCompletion2, _didIteratorError2, _iteratorError2, _iterator2, _step2, _id;

                                    return regeneratorRuntime.wrap(function step$(_context) {
                                        while (1) {
                                            switch (_context.prev = _context.next) {
                                                case 0:
                                                    previousId = track[track.length - 1];

                                                    if (!visitedIds.has(previousId)) {
                                                        _context.next = 3;
                                                        break;
                                                    }

                                                    return _context.abrupt('return');

                                                case 3:

                                                    visitedIds.add(previousId);

                                                    orderedDependencies = graph._orderedDependencyMap.get(previousId) || new Set().values(), unorderedDependencies = graph._unorderedDependencyMap.get(previousId) || new Set().values();
                                                    _iteratorNormalCompletion = true;
                                                    _didIteratorError = false;
                                                    _iteratorError = undefined;
                                                    _context.prev = 8;
                                                    _iterator = orderedDependencies[Symbol.iterator]();

                                                case 10:
                                                    if (_iteratorNormalCompletion = (_step = _iterator.next()).done) {
                                                        _context.next = 25;
                                                        break;
                                                    }

                                                    id = _step.value;

                                                    if (!(previousId === id)) {
                                                        _context.next = 14;
                                                        break;
                                                    }

                                                    return _context.abrupt('continue', 22);

                                                case 14:

                                                    // проверяем нет ли циклической ordered-зависимости
                                                    loopFirstIndex = track.indexOf(id);

                                                    if (!(loopFirstIndex !== -1)) {
                                                        _context.next = 19;
                                                        break;
                                                    }

                                                    // добавляем в цепь замыкающую сущность
                                                    track.push(id);
                                                    // формируем цепь для ошибки
                                                    errorInfo = track.slice(loopFirstIndex).map(function (key) {
                                                        return {
                                                            entity: (0, _bemNaming.parse)(key)
                                                        };
                                                    });
                                                    throw new _dependencyError2.default(errorInfo);

                                                case 19:
                                                    _context.next = 21;
                                                    return [entityMap.get(id), id, true, previousId];

                                                case 21:
                                                    return _context.delegateYield(step(track.concat(id)), 't0', 22);

                                                case 22:
                                                    _iteratorNormalCompletion = true;
                                                    _context.next = 10;
                                                    break;

                                                case 25:
                                                    _context.next = 31;
                                                    break;

                                                case 27:
                                                    _context.prev = 27;
                                                    _context.t1 = _context['catch'](8);
                                                    _didIteratorError = true;
                                                    _iteratorError = _context.t1;

                                                case 31:
                                                    _context.prev = 31;
                                                    _context.prev = 32;

                                                    if (!_iteratorNormalCompletion && _iterator.return) {
                                                        _iterator.return();
                                                    }

                                                case 34:
                                                    _context.prev = 34;

                                                    if (!_didIteratorError) {
                                                        _context.next = 37;
                                                        break;
                                                    }

                                                    throw _iteratorError;

                                                case 37:
                                                    return _context.finish(34);

                                                case 38:
                                                    return _context.finish(31);

                                                case 39:
                                                    _iteratorNormalCompletion2 = true;
                                                    _didIteratorError2 = false;
                                                    _iteratorError2 = undefined;
                                                    _context.prev = 42;
                                                    _iterator2 = unorderedDependencies[Symbol.iterator]();

                                                case 44:
                                                    if (_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done) {
                                                        _context.next = 54;
                                                        break;
                                                    }

                                                    _id = _step2.value;

                                                    if (!(previousId === _id)) {
                                                        _context.next = 48;
                                                        break;
                                                    }

                                                    return _context.abrupt('continue', 51);

                                                case 48:
                                                    _context.next = 50;
                                                    return [entityMap.get(_id), _id, undefined, previousId];

                                                case 50:
                                                    return _context.delegateYield(step([_id]), 't2', 51);

                                                case 51:
                                                    _iteratorNormalCompletion2 = true;
                                                    _context.next = 44;
                                                    break;

                                                case 54:
                                                    _context.next = 60;
                                                    break;

                                                case 56:
                                                    _context.prev = 56;
                                                    _context.t3 = _context['catch'](42);
                                                    _didIteratorError2 = true;
                                                    _iteratorError2 = _context.t3;

                                                case 60:
                                                    _context.prev = 60;
                                                    _context.prev = 61;

                                                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                                                        _iterator2.return();
                                                    }

                                                case 63:
                                                    _context.prev = 63;

                                                    if (!_didIteratorError2) {
                                                        _context.next = 66;
                                                        break;
                                                    }

                                                    throw _iteratorError2;

                                                case 66:
                                                    return _context.finish(63);

                                                case 67:
                                                    return _context.finish(60);

                                                case 68:
                                                case 'end':
                                                    return _context.stop();
                                            }
                                        }
                                    }, _marked[0], this, [[8, 27, 31, 39], [32,, 34, 38], [42, 56, 60, 68], [61,, 63, 67]]);
                                };

                                _marked = [step].map(regeneratorRuntime.mark);
                                startId = (0, _bemNaming.stringify)(startEntity);
                                return _context2.delegateYield(step([startId]), 't0', 4);

                            case 4:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
    }, {
        key: 'dependenciesOf',
        value: function dependenciesOf(entity) {
            var _ref2;

            var id = (0, _bemNaming.stringify)(entity);

            var entityMap = this._entityMap,
                orderedSet = this._orderedDependencyMap.get(id),
                unorderedSet = this._unorderedDependencyMap.get(id);

            if (!orderedSet && !unorderedSet) return new Set().values();

            var orderedIterator = orderedSet && orderedSet.values(),
                unorderedIterator = unorderedSet && unorderedSet.values();

            return _ref2 = {}, _defineProperty(_ref2, Symbol.iterator, function () {
                return this;
            }), _defineProperty(_ref2, 'next', function next() {
                var item = this._iterator.next(),
                    isDone = item.done;

                if (isDone && this._iterator === orderedIterator) {
                    this._iterator = unorderedIterator;
                }

                return {
                    value: entityMap.get(item.value),
                    done: item.done
                };
            }), _defineProperty(_ref2, '_iterator', orderedIterator || unorderedIterator), _ref2;
        }
    }, {
        key: 'orderedDependenciesOf',
        value: function orderedDependenciesOf(entity) {
            return this._dependenciesOfFromMap(entity, this._orderedDependencyMap);
        }
    }, {
        key: 'unorderedDependenciesOf',
        value: function unorderedDependenciesOf(entity) {
            return this._dependenciesOfFromMap(entity, this._unorderedDependencyMap);
        }
    }, {
        key: '_dependenciesOfFromMap',
        value: function _dependenciesOfFromMap(entity, map) {
            var _ref3;

            var id = (0, _bemNaming.stringify)(entity);

            var entityMap = this._entityMap,
                dependenceEntities = map.get(id);

            if (!dependenceEntities) return new Set().values();

            var iterator = dependenceEntities.values();

            return _ref3 = {}, _defineProperty(_ref3, Symbol.iterator, function () {
                return this;
            }), _defineProperty(_ref3, 'next', function next() {
                var item = iterator.next();

                return {
                    value: entityMap.get(item.value),
                    done: item.done
                };
            }), _ref3;
        }
    }]);

    return DependencyGraph;
}();

exports.default = DependencyGraph;
;