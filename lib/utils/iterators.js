export default { series };

function series(...iterators) {
    var iter = iterator(iterators.shift());

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
                iter = iterator(iterators.shift());

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

function iterator(iter) {
    if (iter) {
        if (iter.next) return iter;

        return iter[Symbol.iterator]();
    }
}
