/**
 * import a python module
 * 
 * @param {string} name - the name of the module
 * @returns {Object} the module
 */
function py_import(name) {
  return require(`./${name}/${name}`);
}

/**
 * import all functions and classes from a module into 
 * the current namespace
 * 
 * @param {string} module - the module
 */
function py_import_star(name) {
  Object.entries(require(`./${name}/${name}`)).forEach(
  ([name, exported]) => (global[name] = exported)
);
}


module.exports = {
  py_import,
  py_import_star,
};
