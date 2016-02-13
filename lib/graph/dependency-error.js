import { stringify as stringifyEntity } from 'bem-naming';

/**
 *
 */
export default class DependencyError extends Error {
    constructor(loop) {
        if (!Array.isArray) {
            loop = Array.from(loop);
        }
        super(`dependency graph has circular dependencies (${stringifyLoop(loop)}).`);

        // Error details:
    	this.name = 'DependencyError';
        this.loop = loop;

        // Include stack trace in error object.
    	Error.captureStackTrace(this, this.constructor);
    }
}

/**
 *
 *
 * @param {{entity: Object, tech: String}} loop
 */
function stringifyLoop(loop) {
    return loop.map(({entity, tech}) => {
        var name = stringifyEntity(entity);

        return tech
            ? `${name}.${tech}`
            : name;
    }).join(' <- ');
}
