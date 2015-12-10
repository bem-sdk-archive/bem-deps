'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _bemNaming = require('bem-naming');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var BemTypifier = (function () {
    function BemTypifier() {
        _classCallCheck(this, BemTypifier);

        this._entityMap = new Map();

        this._typedIds = {
            block: new Set(),
            blockMod: new Set(),

            elem: new Set(),
            elemMod: new Set()
        };
    }

    _createClass(BemTypifier, [{
        key: 'typify',
        value: function typify(entity) {
            var id = (0, _bemNaming.stringify)(entity),
                type = (0, _bemNaming.typeOf)(entity);

            this._entityMap.set(id, entity);
            this._typedIds[type].add(id);
        }
    }, {
        key: 'blocks',
        value: function blocks() {
            return this._entitiesByType('block');
        }
    }, {
        key: 'blockModificators',
        value: function blockModificators() {
            return this._entitiesByType('blockMod');
        }
    }, {
        key: 'elements',
        value: function elements() {
            return this._entitiesByType('elem');
        }
    }, {
        key: 'elementModificators',
        value: function elementModificators() {
            return this._entitiesByType('elemMod');
        }
    }, {
        key: '_entitiesByType',
        value: function _entitiesByType(type) {
            var _ref;

            var entities = [],
                entityMap = this._entityMap,
                iterator = this._typedIds[type].values();

            return _ref = {}, _defineProperty(_ref, Symbol.iterator, function () {
                return this;
            }), _defineProperty(_ref, 'next', function next() {
                var item = iterator.next();

                return {
                    value: entityMap.get(item.value),
                    done: item.done
                };
            }), _ref;
        }
    }]);

    return BemTypifier;
})();

exports.default = BemTypifier;
;