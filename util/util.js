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

/**
 * Assert that the given condition is true. If it is not, raise an error.
 * 
 * @param {boolean} - The condition to assert.
 * @param {string} - The error message to raise if the condition is false.
 * @param {boolean} - The expected condition result.
 * @throws {Error} - If the condition is false.
 */
function assert(condition, message, expected = true) {
  if (condition !== expected) {
    throw new Error(message || "Assertion failed");
  }
}

/**
 * Throw an exception.
 * 
 * @param {Exception} - The exception to throw.
 */
function raise(exception) {
  throw exception;
}

module.exports = {
  isIterable,
  listComp,
  assert,
  raise
};
