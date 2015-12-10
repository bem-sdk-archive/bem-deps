import stream from 'stream';

import resolve from './resolve/index.js';

export default function (declaration, options) {
    var flusher = new stream.Transform({ objectMode: true }),
        relations = [];

    flusher._transform = function(relation, encoding, done) {
        relations.push(relation);
        done();
    };

    flusher._flush = function (done) {
        var res = resolve(declaration, relations, options);

        this.push(res);
        done();
    };

    return flusher;
};
