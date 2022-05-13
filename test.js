const { assert } = require("./py");

// Import everything from the module
Object.entries(require("./py")).forEach(
  ([name, exported]) => (global[name] = exported)
);

// Complex test
let my_complex = new Complex(1, 2);
assert(
  my_complex.real === 1 && my_complex.imaginary === 2,
  "Complex construction failed (new Complex(1, 2))"
);
my_complex = complex(1, 2);
assert(
  my_complex.real === 1 && my_complex.imaginary === 2,
  "Complex construction failed (complex(1, 2))"
);
assert(my_complex.toString() === "(1 + 2i)", "Complex toString failed");
assert(
  my_complex.add(complex(3, 4)).toString() === "(4 + 6i)",
  "Complex add failed"
);
assert(
  my_complex.sub(complex(3, 4)).toString() === "(-2 - 2i)",
  "Complex sub failed"
);
assert(
  my_complex.mul(complex(3, 4)).toString() === "(-5 + 10i)",
  "Complex mul failed"
);
assert(
  my_complex.div(complex(3, 4)).toString() === "(0.44 + 0.08i)",
  "Complex div failed"
);
assert(
  my_complex.conjugate().toString() === "(1 - 2i)",
  "Complex conjugate failed"
);
assert(my_complex.magnitude === 2.23606797749979, "Complex magnitude failed");
assert(my_complex.phase === 1.1071487177940904, "Complex phase failed");
assert(
  my_complex.polar[0] === 2.23606797749979 &&
    my_complex.polar[1] === 1.1071487177940904,
  "Complex polar failed"
);
assert(
  Complex.fromString("(1 + 2i)").toString() === my_complex.toString(),
  "Complex fromString failed"
);
assert(
  isclose(
    Complex.fromPolar(2.23606797749979, 1.1071487177940904).real,
    my_complex.real
  ) &&
    isclose(
      Complex.fromPolar(2.23606797749979, 1.1071487177940904).imaginary,
      my_complex.imaginary
    ),
  "Complex fromPolar failed"
);

// Dict test
my_dict = dict({ a: 1, b: 2 });
assert(
  my_dict["a"] === 1 && my_dict.get("b") === 2,
  "Dict construction failed"
);
my_dict = dict([
  ["a", 1],
  ["b", 2],
]);
assert(
  my_dict["a"] === 1 && my_dict.get("b") === 2,
  "Dict iterable construction failed"
);
assert(my_dict.toString() === "{a: 1, b: 2}", "Dict toString failed");
assert(
  my_dict.keys().length === 2 && my_dict.keys()[0] === "a",
  "Dict keys failed"
);
assert(
  my_dict.values().length === 2 && my_dict.values()[0] === 1,
  "Dict values failed"
);
assert(
  my_dict.items().length === 2 && my_dict.items()[0][0] === "a",
  "Dict items failed"
);
item = my_dict.pop("a");
assert(item === 1 && !my_dict.get("a"), "Dict pop failed");
assert(
  my_dict.keys().length === 1,
  "Dict pop2 failed"
);
my_dict.clear();
assert(my_dict.keys().length === 0, "Dict clear failed");
my_dict.set("a", 1);
my_dict.set("b", 2);
assert(
  my_dict.get("a") === 1 && my_dict.get("b") === 2,
  "Dict set failed"
);
my_dict2 = my_dict.copy();
assert(
  my_dict !== my_dict2 && my_dict.items()[0][0] === my_dict2.items()[0][0],
  "Dict copy failed"
);
my_dict2.update({a: 3, c: 4, d: 5 });
assert(
  my_dict2.get("a") === 3 && my_dict2.get("c") === 4 && my_dict2.get("d") === 5,
  "Dict update failed"
);
item = my_dict2.popitem();
assert(item[0] === "d" && item[1] === 5, "Dict popitem failed");
assert(
  my_dict2.keys().length === 3 && my_dict2.keys()[0] === "a",
  "Dict popitem failed"
);
dict3 = Dict.fromkeys(["a", "b", "c"]);
assert(
  dict3.keys().length === 3 && dict3.keys()[0] === "a" && dict3.get("a") === null,
  "Dict fromkeys failed"
);
dict4 = Dict.fromkeys(["a", "b", "c"], 1);
assert(
  dict4.keys().length === 3 && dict4.keys()[0] === "a" && dict4.get("b") === 1,
  "Dict fromkeys failed"
);

// Frozenset tests
my_frozenset = frozenset([1]);
assert(
  my_frozenset.has(1),
  "Frozenset construction failed"
);
my_frozenset = frozenset([1, 2, 3]);
assert(
  my_frozenset.has(1) && my_frozenset.has(2) && my_frozenset.has(3),
  "Frozenset iterable construction failed"
);
try {
  my_frozenset.add(4);
} catch (e) {
}
assert(
  !my_frozenset.has(4),
  "Frozenset add failed"
);
assert(
  my_frozenset.toString() === "FrozenSet({1, 2, 3})",
  "Frozenset toString failed"
)

// Tuple tests
my_tuple = tuple([1]);
assert(
  my_tuple[0] === 1,
  "Tuple construction failed"
);
assert(
  my_tuple.toString() === "(1,)",
)
my_tuple = tuple([1, 2, 3]);
assert(
  my_tuple[0] === 1 && my_tuple[1] === 2 && my_tuple[2] === 3,
  "Tuple iterable construction failed"
);
assert(
  my_tuple.toString() === "(1, 2, 3)",
  "Tuple toString failed"
);
assert( 1 in my_tuple, "Tuple in failed" );
my_tuple
assert(
  my_tuple.index(1) === 0,
)
assert(
  my_tuple.count(1) === 1,
)
try {
  my_tuple.push(4);
} catch (e) {
}
assert(
  my_tuple.length === 3,
  "Tuple push succeeded (this is bad)"
);
try {
  my_tuple.pop();
} catch (e) {
}
assert(
  my_tuple.length === 3,
  "Tuple pop succeeded (this is bad)"
);

// List tests
my_list = list([3]);
my_list.append(4)
item = my_list.pop()
print(my_list)





print("All tests passed");