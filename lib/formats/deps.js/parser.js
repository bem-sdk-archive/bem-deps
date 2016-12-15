'use strict';

const debug = require('debug')('bem-deps');
const declAssign = require('bem-decl/lib/assign');
const declNormalize = require('bem-decl/lib/normalize/v2');

/**
 * @param {Array<{entity: BemEntityName, scope: ?BemCell, data: *}>} depsData - List of deps
 * @returns {Array<*>}
 */
module.exports = function parse(depsData) {
    const mustDeps = [];
    const shouldDeps = [];
    const mustDepsIndex = {};
    const shouldDepsIndex = {};

    depsData.forEach(record => {
        const scope = record.scope || { entity: record.entity };

        if (!record.data) {
            return;
        }
        const data = [].concat(record.data);

        data.forEach(dep => {
            const subscope = declAssign({
                entity: dep.mod ?
                    { block: dep.block, elem: dep.elem, modName: dep.mod, modVal: dep.val } :
                    { block: dep.block, elem: dep.elem },
                tech: dep.tech
            }, scope);
            const subscopeKey = subscope.id;

            if (dep.mustDeps) {
                declNormalize(dep.mustDeps, subscope).forEach(function (nd) {
                    const key = nd.id;
                    const indexKey = subscopeKey + '→' + key;
                    if (!mustDepsIndex[indexKey]) {
                        subscopeKey === key ||
                            mustDeps.push({ vertex: subscope, dependOn: nd, ordered: true, path: record.path });
                        mustDepsIndex[indexKey] = true;
                    }
                });
            }
            if (dep.shouldDeps) {
                declNormalize(dep.shouldDeps, subscope).forEach(function (nd) {
                    const key = nd.id;
                    const indexKey = subscopeKey + '→' + key;
                    if (!shouldDepsIndex[indexKey]) {
                        subscopeKey === key ||
                            shouldDeps.push({ vertex: subscope, dependOn: nd, path: record.path });
                        shouldDepsIndex[indexKey] = true;
                    }
                });
            }
            if (dep.noDeps) {
                declNormalize(dep.noDeps, subscope).forEach(function (nd) {
                    const key = nd.id;
                    const indexKey = subscopeKey + '→' + key;
                    removeFromDeps(key, indexKey, mustDepsIndex, mustDeps);
                    removeFromDeps(key, indexKey, shouldDepsIndex, shouldDeps);
                });
            }
        });
    });

    function removeFromDeps(key, indexKey, index, list) {
        if (index[indexKey]) {
            for (var i = 0, l = list.length; i < l; i++) {
                if (list[i].dependOn.id === key) {
                    return list.splice(i, 1);
                }
            }
        } else {
            index[indexKey] = true;
        }
        return null;
    }

    debug('parsed-deps: ', mustDeps.concat(shouldDeps)
        .map(v => `${v.vertex.id} ${v.ordered ? '=>' : '->'} ${v.dependOn.id} : ${v.path}`));

    return mustDeps.concat(shouldDeps);
};
