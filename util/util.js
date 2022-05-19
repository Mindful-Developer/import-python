function isIterable(obj) {
  if (obj == null) {
    return false;
  }
  return typeof obj[Symbol.iterator] === "function";
}

function listComp(iterable, func, condition = undefined) {
  let result = [];
  for (let element of iterable) {
    if (!condition || condition(element)) {
      result.push(func(element));
    }
  }
  return result;
}

module.exports = {
  isIterable,
  listComp,
};
