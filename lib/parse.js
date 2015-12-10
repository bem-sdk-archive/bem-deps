var stream = require('stream');

export default function parse(cb) {
    var transform = new stream.Transform({ objectMode: true });

    transform._transform = function(entityDeps, encoding, done) {
        this.push(cb(entityDeps));
        done();
    };

    return transform;
};
