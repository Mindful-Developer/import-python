function py_import(name) {
  return require(`./${name}/${name}`);
}

function py_import_star(name) {
  Object.entries(require(`./${name}/${name}`)).forEach(
  ([name, exported]) => (global[name] = exported)
);
}


module.exports = {
  py_import,
  py_import_star,
};
