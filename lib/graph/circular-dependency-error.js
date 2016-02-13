import { stringify as stringifyEntity } from 'bem-naming';

import BemEntityTech from '../bem/bem-entity-tech';

/**
 *
 */
export default class СircularDependencyError extends Error {
    constructor(loop) {
        loop = Array.from(loop || []);

        let message = 'dependency graph has circular dependencies';
        if (loop.length) {
            message = `${message} (${loop.join(' <- ')})`;
        }

        super(message);

        // Error details:
    	this.name = 'СircularDependencyError';
        this._loop = loop;

        // TODO:
        Object.defineProperty(this, 'loop', {
            get: () => this._loop
        });
    }
}
