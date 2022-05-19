const { next, list, range, tuple, len, reversed, print, pow, iter, bool, dict, enumerate, zip } = require('../core/core')
const { listComp } = require('../util/util')

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

function* chain(...iterables) {
  for (let it of iterables) {
    for (let element of it) {
      yield element;
    }
  }
}

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

function* compress(data, selectors) {
  for (let i = 0; i < len(data); i++) {
    if (selectors[i]) {
      yield data[i];
    }
  }
}

function* count(start=0, step=1) {
  let n = start;
  while (true) {
    yield n;
    n += step;
  }
}

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

function groupby(iterable, key=null) {
  return new Groupby(iterable, key);
}

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

function pairwise(iterable) {
  const [a, b] = tee(iterable);
  next(b, null);
  return zip(a, b);
}

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

function* starmap(func, iterable) {
  for (let args of iterable) {
    yield func(...args);
  }
}

function* takewhile(predicate, iterable) {
  for (let element of iterable) {
    if (predicate(element)) {
      yield element;
    } else {
      break;
    }
  }
}

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

///////////////////////////////////////////////////////////////////////////////

// print(list(accumulate([1, 2, 3, 4, 5], (a, b) => a + b)));
// print(list(chain([1, 2, 3], [4, 5, 6], [7, 8, 9])));
// print(list(combinations([1, 2, 3, 4, 5], 3)));
// print(list(combinations_with_replacement('abc', 2)));
// print(list(compress('abcdef', [1,0,1,0,1,1])));

// const my_count = count(1, 2);
// for (let i = 0; i < 10; i++) {
//   print(next(my_count));
// }

// const my_cycle = cycle('abc');
// for (let i = 0; i < 10; i++) {
//   print(next(my_cycle));
// }

// print(list(pairwise("ABCDEFG")));

// print(list(dropwhile((x) => x < 5, [1,4,6,4,1])))
// print(list(filterfalse((x) => x % 2, range(10))))

// print(listComp(groupby("AAAABBBCCDAABBB"), (x) => x[0]));
// print(listComp(groupby("AAAABBBCCD"), (x) => list(x[1])));

// print(list(islice('ABCDEFG', 2)))
// print(list(islice('ABCDEFG', 2, 4)))
// print(list(islice('ABCDEFG', 2, null)))
// print(list(islice('ABCDEFG', 2, null, 2)))

// print(list(permutations('ABCD', 2)));
// print(list(permutations(range(3))));

// print(list(product(1, "ABCDE", "xy")));
// print(list(product(3, range(2))));

// print(list(repeat(10, 3)));
// print(list(starmap(pow, [[2, 5], [3, 2], [10, 3]])));
// print(list(takewhile((x) => x < 5, [1,4,6,4,1])));

// const t = tee(iter("ABCDEFG"));
// print(list(t[0]));
// print(list(t[1]));

// print(list(zip_longest('-', 'ABCD', 'xy')));
