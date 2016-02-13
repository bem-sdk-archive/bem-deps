import { stringify as stringifyEntity } from 'bem-naming';

import BemEntity from '../bem/bem-entity';
import BemImplement from '../bem/bem-implement';

/**
 *
 */
export default class СircularDependencyError extends Error {
    constructor(loop) {
        loop = Array.from(loop || []).map(obj => {
            if (obj.id) return obj;

            var entity = new BemEntity(obj.entity);

            return new BemImplement(entity, obj.tech);
        });

        var message = 'dependency graph has circular dependencies';
        if (loop.length) {
            message = `${message} (${stringifyLoop(loop)})`;
        }

        super(message);

        // Error details:
    	this.name = 'СircularDependencyError';
        this._loop = loop.map(implement => implement.valueOf());

        // TODO:
        Object.defineProperty(this, 'loop', {
            get: () => this._loop
        });
    }
}

function stringifyLoop(loop) {
    return loop.map(implement => implement.id).join(' <- ');
}
