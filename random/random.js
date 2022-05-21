const { List } = require("../core/core")

/** Class to generate random numbers. */
class Random {
  /**
   * Create a random number.
   * @param {number} seed 
   * @returns {Random} a random number generator
   */
  constructor(seed = null) {
    this.seed = seed;
  }

  /**
   * Set the seed of the random number generator.
   * @param {number | string | boolean} seed
   * @returns {number} the seed
   * @throws {Error} if the seed is not a number, string, or boolean
   */
  setSeed(seed) {
    if (typeof seed === "string") {
      this.seed = seed.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    } else if (typeof seed === "number") {
      this.seed = seed;
    } else if (typeof seed === "boolean") {
      this.seed = seed ? 1 : 0;
    } else {
      throw new Error("Invalid seed type");
    }
    while (this.seed >= 1) {
      this.seed /= 10;
    }
    return this.seed;
  }

  #mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6d2b79f5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /**
   * Generate a random number using the mulberry32 algorithm.
   * 
   * @returns {number} a random number between 0 and 1
   */
  genRandom() {
    this.seed = this.#mulberry32(this.seed * 1000000000)();
    return this.seed;
  }
}

/**
 * Generate a random integer between start and end.
 * 
 * @param {number} - the start of the range (inclusive)
 * @param {number} - the end of the range (inclusive)
 * @returns {number} a random number between start and end
 */
function randint(start, end) {
  return Math.floor(random() * (end - start + 1)) + start;
}

/**
 * Return a random element from a non-empty iterable.
 * 
 * @param {iterable} - the iterable 
 * @returns {object} a random element from the iterable
 */
function choice(iterable) {
  return iterable[randint(0, len(iterable) - 1)];
}

/**
 * Return k random elements from a non-empty iterable.
 * 
 * @param {iterable} - the iterable
 * @param {number} - the number of elements to return 
 * @returns {List} a list of k random elements from the iterable
 */
function choices(iterable, k) {
  let result = list();
  for (let i = 0; i < k; i++) {
    result.append(choice(iterable));
  }
  return result;
};

/**
 * Shuffle an array in place.
 * 
 * @param {iterable} - the iterable to shuffle 
 * @returns {List} a shiffled list of the elements of the iterable
 */
function shuffle(iterable) {
  let result = [...iterable];
  for (let i = 0; i < len(result); i++) {
    let j = randint(0, len(result) - 1);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return list(result);
};

/**
 * Return k elements from a non-empty iterable without replacement.
 * 
 * @param {iterable} - the iterable 
 * @param {number} - the number of elements to return
 * @returns {List} a list of k elements from the iterable
 */
function sample(iterable, k = 1) {
  iterable = [...iterable];
  let result = [];
  for (let i = 0; i < k; i++) {
    let j = randint(0, len(iterable) - 1);
    result.push(iterable[j]);
    iterable.splice(j, 1);
  }
  return list(result);
};

/**
 * Return a number between start and end.
 * 
 * @param {number} - the start of the range (inclusive) 
 * @param {number} - the end of the range (inclusive) 
 * @returns {number} a random number between start and end
 */
function uniform(start, end) {
  return random() * (end - start) + start;
}

/**
 * Return a random integer between start and end with optional step.
 * 
 * @param {number} - the stop of the range (exclusive)
 * @param {number} - the start of the range (inclusive)
 * @param {number} - the step between numbers
 * @returns {number} a random number between start and stop
 */
function randrange(stop, start = null, step = 1) {
  if (start !== null) {
    [stop, start] = [start, stop];
  }

  let n = stop - start;
  if (n < 0) {
    n = -n;
  }
  if (step == 0) {
    raise(new ValueError("zero step"));
  }
  if (step > 0) {
    return start + Math.floor((random() * n) / step) * step;
  } else {
    return start + Math.floor((random() * n) / -step) * -step;
  }
}

/**
 * Return a random number between 0 and 1.
 * 
 * @returns {number} a random number between 0 and 1
 */
function random() {
  return GLOBALRANDOM.genRandom();
}

/**
 * Set the seed of the random number generator.
 * 
 * @param {number | string | boolean} seed - the seed
 * @returns {number} the seed
 */
function seed(seed) {
  return GLOBALRANDOM.setSeed(seed);
}

global.GLOBALRANDOM = new Random(Math.random());

module.exports = {
  Random,
  random,
  seed,
  randint,
  choice,
  choices,
  shuffle,
  sample,
  uniform,
  randrange,
};
