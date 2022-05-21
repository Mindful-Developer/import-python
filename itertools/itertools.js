const { next, list, range, tuple, len, reversed, iter, bool, dict, enumerate, zip } = require('../core/core')
const { listComp } = require('../util/util')

/**
 * Add the elements of an iterable (or something that can be converted to an iterable)
 * to produce a single value.
 * 
 * @param {Iterable} - The iterable to accumulate over.
 * @param {Function} - The function to use to combine the elements.
 * @param {number} - The initial value to start with.
 * @returns {Generator} - A generator that yields the accumulated value.
 */
function* accumulate(iterable, func, initial=null) {
  let it = iter(iterable);
  let total = initial;
  if (initial === null) {
    try {
      total = next(it);
    } catch (err) {
      if (err.name !== 'StopIteration') {
        return;
      } else {
        throw err
      }
    }
  }
  yield total;
  for (let item of it) {
    total = func(total, item);
    yield total;
  }
}

/**
 * Chain together the results of several iterables.
 * 
 * @param  {...Iterable} - The iterables to chain together.
 * @returns {Generator} - A generator that yields the results of the chained iterables.
 */
function* chain(...iterables) {
  for (let it of iterables) {
    for (let element of it) {
      yield element;
    }
  }
}

/**
 * Return successive r-length combinations of elements in the iterable.
 * 
 * @param {Iterable} - The iterable to combine over.
 * @param {number} - The number of elements to combine.
 * @returns {Generator} - A generator that yields the combinations.
 */
function* combinations(iterable, r) {
  let pool = tuple(iterable);
  let n = len(pool);
  if (r > n) {
    return;
  }
  let indices = list(range(r));
  yield tuple(listComp(indices, (i) => pool[i]));

  let i = r - 1;
  while (true) {
    after: {
      for (i of reversed(range(r))) {
        if (indices[i] != i + n - r) {
          break after;
        }
      }
      return;
    }
    indices[i] += 1;
    for (let j of range(i + 1, r)) {
      indices[j] = indices[j - 1] + 1;
    }
    yield tuple(listComp(indices, (i) => pool[i]));
  }
}

// combinations_with_replacement(iterable, r)
/**
 * Return successive r-length combinations of elements in the iterable.
 * The combinations can have duplicate elements.
 * 
 * @param {Iterable} - The iterable to combine over.
 * @param {number} - The number of elements to combine.
 * @returns {Generator} - A generator that yields the combinations.
 */
function* combinations_with_replacement(iterable, r) {
  let pool = tuple(iterable);
  let n = len(pool);
  if (!n && r) {
    return;
  }
  let indices = list();
  for (let i = 0; i < r; i++) {
    indices.append(0);
  }
  yield tuple(listComp(indices, (i) => pool[i]));

  let i = r - 1;
  while (true) {
    after: {
      for (i of reversed(range(r))) {
        if (indices[i] !== n - 1) {
          break after;
        }
      }
      return;
    }
    for (i of range(i, r)) {
      indices[i] = (indices[i] + 1) % n;
    }
    yield tuple(listComp(indices, (i) => pool[i]));
  }
}

/**
 * Return elements from an iterable as long as the predicate is true.
 * 
 * @param {Iterable} - The iterable to filter.
 * @param {Iterable} - The iterable of booleans to filter by.
 * @returns {Generator} - A generator that yields the filtered elements.
 */
function* compress(data, selectors) {
  for (let i = 0; i < len(data); i++) {
    if (selectors[i]) {
      yield data[i];
    }
  }
}

/**
 * Return an infinite iterator of integers starting at start and increasing by step.
 * 
 * @param {number} - The starting value.
 * @param {number} - The step size.
 * @returns {Generator} - A generator that yields the integers.
 */
function* count(start=0, step=1) {
  let n = start;
  while (true) {
    yield n;
    n += step;
  }
}

/**
 * Return an iterator that returns elements from the iterable and then
 * repeats the same sequence forever.
 * 
 * @param {Iterable} - The iterable to repeat.
 * @returns {Generator} - A generator that yields the repeated elements.
 */
function* cycle(iterable) {
  let it = iterable;
  let cache = [];
  for (let element of it) {
    cache.push(element);
  }
  while (cache) {
    for (let element of cache) {
      yield element;
    }
  }
}

/**
 * Return an iterator that drops elements from the iterable as long as the predicate is true.
 * 
 * @param {function} - The function to filter by.
 * @param {Iterable} - The iterable to filter.
 */
function* dropwhile(predicate, iterable) {
  let it = iter(iterable);
  for (let x of it) {
    if (!predicate(x)) {
      yield x;
      break;
    }
  }
  for (let x of it) {
    yield x;
  }
}

/**
 * Return an iterator that filters elements from the iterable as long as the predicate is true.
 * 
 * @param {function} - The function to filter by.
 * @param {Iterable} - The iterable to filter.
 */
function* filterfalse(predicate, iterable=null) {
  if (iterable === null) {
    [predicate, iterable] = [bool, predicate];
  }
  for (let x of iterable) {
    if (!predicate(x)) {
      yield x;
    }
  }
}

class Groupby {
  constructor(iterable, key = null) {
    if (key === null) {
      key = (x) => x;
    }
    this.keyfunc = key;
    this.it = iter(iterable);
    this.tgtkey = this.currkey = this.currvalue = new dict();
  }

  [Symbol.iterator]() {
    return this;
  }

  next() {
    this.id = new dict();
    while (this.currkey === this.tgtkey) {
      try {
        this.currvalue = next(this.it);
      } catch (err) {
        if (err.message !== "StopIteration") {
          throw err;
        } else {
          return { done: true };
        }
      }
      this.currkey = this.keyfunc(this.currvalue);
    }
    this.tgtkey = this.currkey;
    return { value: tuple([this.currkey, this.#grouper(this.tgtkey, this.id)]), done: false };
  }

  *#grouper(tgtkey, id) {
    while (this.id === id && this.currkey === tgtkey) {
      yield this.currvalue;
      try {
        this.currvalue = next(this.it);
      } catch (err) {
        if (err.message !== "StopIteration") {
          throw err;
        } else {
          return;
        }
      }
      this.currkey = this.keyfunc(this.currvalue);
    }
  }
}

/**
 * Return an iterator that groups elements from the iterable into a sequence of tuples.
 * The first element of each tuple is the key to the group.
 * The second element of each tuple is the iterator of the group.
 * 
 * @param {Iterable} - The iterable to group.
 * @param {function} - The function to group by.
 * @returns {Generator} - A generator that yields the grouped elements.
 */
function groupby(iterable, key=null) {
  return new Groupby(iterable, key);
}

/**
 * Return an iterator that returns selected elements from the iterable.
 * 
 * @param {Iterable} - The iterable to slice.
 * @param {number} - The starting index.
 * @param {number} - The ending index.
 * @param {number} - The step size.
 * @returns {Generator} - A generator that yields the sliced elements.
 */
function* islice(
  iterable,
  start = 0,
  stop = Number.MAX_VALUE,
  step = 1
) {
  if (stop === Number.MAX_VALUE && start !== 0) {
    stop = start;
    start = 0;
  }
  if (stop === null) {
    stop = Number.MAX_VALUE;
  }
  const it = iter(range(start, stop, step));
  let nexti = null;
  try {
    nexti = next(it);
  } catch (err) {
    if (err.message !== "StopIteration") {
      throw err;
    } else {
      for (let [i, element] of zip(range(start), iterable)) {
      }
      return;
    }
  }
  let i = null;
  let element = null;
  try {
    for ([i, element] of enumerate(iterable)) {
      if (i === nexti) {
        yield element;
        nexti = next(it);
      }
    }
  } catch (err) {
    if (err.message !== "StopIteration") {
      throw err;
    } else {
      for ([i, element] of zip(range(i + 1, stop), iterable)) {
      }
    }
  }
}

/**
 * Return an iterator that returns pairs of elements from the iterable.
 * 
 * @param {Iterable} - The iterable to pair.
 * @returns {Generator} - A generator that yields the paired elements.
 */
function pairwise(iterable) {
  const [a, b] = tee(iterable);
  next(b, null);
  return zip(a, b);
}

/**
 * Return an iterator that returns permutations of the elements from the iterable.
 * 
 * @param {Iterable} - The iterable to permute.
 * @param {number} - The number of elements to permute.
 * @returns {Generator} - A generator that yields the permuted elements.
 */
function* permutations(iterable, r=null) {
  const pool = tuple(iterable);
  let n = len(pool);
  if (r === null) {
    r = n;
  }
  if (r > n) {
    return;
  }
  const indices = list(range(n));
  const cycles = list(range(n, n - r, -1));
  yield tuple(listComp(indices.slice(0, r), (i) => pool[i]));
  while (n) {
    after: {
      for (let i of reversed(range(r))) {
        cycles[i] -= 1;
        if (cycles[i] === 0) {
          let new_arr = [...indices.slice(i + 1), ...indices.slice(i, i + 1)];
          for (let j of range(len(new_arr))) {
            indices[i+j] = new_arr[j];
          }
          cycles[i] = n - i;
        } else {
          let j = cycles[i];
          [indices[i], indices[len(indices) - j]] = [indices[len(indices) - j], indices[i]];
          yield tuple(listComp(indices.slice(0, r), (i) => pool[i]));
          break after;
        }
      }
      return;
    }
  }
}

/**
 * Return an iterator that returns the cartesian product of the iterables.
 * 
 * @param {number} - The number of times to repeat the product.
 * @param  {...any} - The iterables to product.
 * @returns {Generator} - A generator that yields the cartesian product.
 */
function* product(repeat = 1, ...args) {
  if (typeof repeat !== "number") {
    args = [repeat, ...args];
    repeat = 1;
  };
  const argsCopy = list([]);
  for (let arg of args) {
    argsCopy.append(list(arg));
  };
  let pools = list([]);
  for (let i = 0; i < repeat; i++) {
    for (let arg of argsCopy) {
      pools.append(arg);
    }
  }
  let result = list([list([])]);
  for (let pool of pools) {
    let temp = list([]);
    for (let x of result) {
      for (let y of pool) {
        temp.append(list([...x, y]));
      }
    }
    result = temp;
  }
  for (let prod of result) {
    yield tuple(prod);
  }
}

/**
 * Return an iterator that returns the same element n times.
 * 
 * @param {any} - The element to repeat.
 * @param {number} - The number of times to repeat the element.
 */
function* repeat(object, times=null) {
  if (times === null) {
    while (true) {
      yield object;
    }
  } else {
    for (let i = 0; i < times; i++) {
      yield object;
    }
  }
}

/**
 * Return an iterator that returns the results of applying func to the elements from the iterable.
 * 
 * @param {function} - The function to apply to the elements.
 * @param {Iterable} - The iterable to apply the function to.
 * @returns {Generator} - A generator that yields the results of applying func to the elements.
 */
function* starmap(func, iterable) {
  for (let args of iterable) {
    yield func(...args);
  }
}

/**
 * Return an iterator that returns elements from the iterable as long as the predicate is true.
 * 
 * @param {function} - The predicate function.
 * @param {Iterable} - The iterable to take elements from.
 * @returns {Generator} - A generator that yields the elements from the iterable.
 */
function* takewhile(predicate, iterable) {
  for (let element of iterable) {
    if (predicate(element)) {
      yield element;
    } else {
      break;
    }
  }
}

/**
 * Return an iterator that returns n independent iterators of the iterable.
 * 
 * @param {Iterable} - The iterable to tee.
 * @param {number} - The number of iterators to return.
 * @returns {Generator} - A generator that yields the iterators.
 */
function tee(iterable, n=2) {
  const it = list(iterable);
  function* gen(mydeque) {
    let newval = null;
    let itCopy = iter(it.copy());
    while (true) {
        try {
          newval = next(itCopy);
        } catch (err) {
          if (err.message !== "StopIteration") {
            throw err;
          } else {
            return;
          }
        }
        mydeque.append(newval);
        yield newval;
    }
  }
  let temp = [];
  for (let x of range(n)) {
    temp.push(gen(list([])));
  }
  return tuple(temp);
}

/**
 * Return an iterator that returns elements from the iterables. The iterator stops 
 * when the longest iterable is exhausted. If the iterables are of different lengths,
 * missing values are filled with the fillvalue.
 * 
 * @param {Any} - The fillvalue to use.
 * @param  {...any} - The iterables to zip.
 * @returns {Generator} - A generator that yields the zipped elements.
 */
function* zip_longest(fillvalue=null, ...args) {
  let longest = 0;
  for (let arg of args) {
    if (len(arg) > longest) {
      longest = len(arg);
    }
  }
  for (let i = 0; i < longest; i++) {
    let temp = [];
    for (let arg of args) {
      temp.push(arg[i] ?? fillvalue);
    }
    yield tuple(temp);
  }
}

module.exports = {
  accumulate,
  chain,
  combinations,
  combinations_with_replacement,
  compress,
  count,
  cycle,
  dropwhile,
  filterfalse,
  groupby,
  islice,
  pairwise,
  permutations,
  product,
  repeat,
  starmap,
  takewhile,
  tee,
  zip_longest,
};
