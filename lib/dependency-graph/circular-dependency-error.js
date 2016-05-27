import ExtendableError from 'es6-error';

/**
 *
 */
export default class СircularDependencyError extends ExtendableError {
    constructor(loop) {
        loop = Array.from(loop || []);

        let message = 'dependency graph has circular dependencies';
        if (loop.length) {
            message = `${message} (${loop.join(' <- ')})`;
        }

        super(message);

        this._loop = loop;
    }
    get loop() {
        return this._loop;
    }
}
