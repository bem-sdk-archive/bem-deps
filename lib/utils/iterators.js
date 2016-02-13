export default { series };

function series(...iterators) {
    var iter = iterators.shift();

    return {
        [Symbol.iterator]: function() {
            return this;
        },
        next: function next() {
            if (!iter) {
                return { done: true };
            }

            var next = iter.next();

            // если итератор закончился переходим к следующему
            // если тот тоже закончился, то к следующему
            while (next.done) {
                iter = iterators.shift();

                // если итераторы закончились, выходим
                if (!iter) {
                    return { done: true };
                }

                next = iter.next();
            }

            return next;
        }
    };
}
