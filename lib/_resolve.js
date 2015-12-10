export * from './resolve/index.js';

// import stream from 'stream';
//
// import resolve from './resolve/index.js';
//
// export default function ({declaration, options}) {
//     var flusher = new stream.Transform({ objectMode: true }),
//         relations = [];
//
//     flusher._transform = function(chunk, encoding, done) {
//         relations.push(chunk);
//         done();
//     };
//
//     flusher._flush = function (done) {
//         var res = resolve(declaration, relations, options);
// console.log(res);
//         this.write(res, done);
//     };
//
//     return flusher;
// };
