class Random {
  constructor(seed = null) {
    if (typeof seed === "string") {
      this.seed = seed.split("").reduce((a, b) => a + b.charCodeAt(0), 0);
    } else if (typeof seed === "number") {
      this.seed = seed;
    } else if (typeof seed === "boolean") {
      this.seed = seed ? 1 : 0;
    } else {
      this.seed = Math.random();
    }
    if (this.seed > 1) {
      while (this.seed > 1) {
        this.seed = this.seed / 10;
      }
    }
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

  random() {
    this.seed = this.#mulberry32(this.seed * 1000000)();
    return this.seed;
  }

  randint = (start, end) =>
    Math.floor(this.random() * (end - start + 1)) + start;

  choice = (iterable) => iterable[this.randint(0, len(iterable) - 1)];

  choices = (iterable, k) => {
    let result = list();
    for (let i = 0; i < k; i++) {
      result.append(this.choice(iterable));
    }
    return result;
  };

  shuffle = (array) => {
    let result = [...array];
    for (let i = 0; i < len(result); i++) {
      let j = this.randint(0, len(result) - 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };

  sample = (array, k = 1) => {
    array = [...array];
    let result = [];
    for (let i = 0; i < k; i++) {
      let j = this.randint(0, len(array) - 1);
      result.push(array[j]);
      array.splice(j, 1);
    }
    return result;
  };

  uniform(start, end) {
    return this.random() * (end - start) + start;
  }

  randrange(stop, start = null, step = 1) {
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
      return start + Math.floor((this.random() * n) / step) * step;
    } else {
      return start + Math.floor((this.random() * n) / -step) * -step;
    }
  }
}

function random(seed = null) {
  return new Random(seed);
}

module.exports = {
  Random,
  random,
};
