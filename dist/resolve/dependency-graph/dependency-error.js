'use strict';

var _util = require('util');

var _util2 = _interopRequireDefault(_util);

var _bemNaming = require('bem-naming');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function DependencyError(loop) {
	// error details
	this.name = 'DependencyError';
	this.loop = loop;
	this.message = 'dependency graph has circular dependencies (' + stringifyLoop(loop) + ').';

	// include stack trace in error object
	Error.captureStackTrace(this, this.constructor);
}

_util2.default.inherits(DependencyError, Error);

module.exports = DependencyError;

function stringifyLoop(loop) {
	return loop.map(function (item) {
		var key = (0, _bemNaming.stringify)(item.entity),
		    tech = item.tech;

		if (tech) {
			return key + '.' + tech;
		}

		return key;
	}).join(' <- ');
}