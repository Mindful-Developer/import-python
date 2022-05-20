const fs = require("fs");
const { py_import_star, py_import } = require("../import-python");
const { seed } = require("../random/random");
const { listComp } = require("../util/util");

py_import_star("core");
py_import_star("random");
py_import_star("itertools");

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
  Complex.fromPolar(2.23606797749979, 1.1071487177940904).real ===
    my_complex.real &&
    Complex.fromPolar(2.23606797749979, 1.1071487177940904).imaginary ===
      my_complex.imaginary,
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
assert(my_dict.keys().length === 1, "Dict pop2 failed");
my_dict.clear();
assert(my_dict.keys().length === 0, "Dict clear failed");
my_dict.set("a", 1);
my_dict.set("b", 2);
assert(my_dict.get("a") === 1 && my_dict.get("b") === 2, "Dict set failed");
my_dict2 = my_dict.copy();
assert(
  my_dict !== my_dict2 && my_dict.items()[0][0] === my_dict2.items()[0][0],
  "Dict copy failed"
);
my_dict2.update({ a: 3, c: 4, d: 5 });
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
  dict3.keys().length === 3 &&
    dict3.keys()[0] === "a" &&
    dict3.get("a") === null,
  "Dict fromkeys failed"
);
dict4 = Dict.fromkeys(["a", "b", "c"], 1);
assert(
  dict4.keys().length === 3 && dict4.keys()[0] === "a" && dict4.get("b") === 1,
  "Dict fromkeys failed"
);

// Frozenset tests
my_frozenset = frozenset([1]);
assert(my_frozenset.has(1), "Frozenset construction failed");
my_frozenset = frozenset([1, 2, 3]);
assert(
  my_frozenset.has(1) && my_frozenset.has(2) && my_frozenset.has(3),
  "Frozenset iterable construction failed"
);
try {
  my_frozenset.add(4);
} catch (e) {}
assert(!my_frozenset.has(4), "Frozenset add failed");
assert(
  my_frozenset.toString() === "FrozenSet({1, 2, 3})",
  "Frozenset toString failed"
);

// Tuple tests
my_tuple = tuple([1]);
assert(my_tuple[0] === 1, "Tuple construction failed");
assert(my_tuple.toString() === "(1,)");
my_tuple = tuple([1, 2, 3]);
assert(
  my_tuple[0] === 1 && my_tuple[1] === 2 && my_tuple[2] === 3,
  "Tuple iterable construction failed"
);
assert(my_tuple.toString() === "(1, 2, 3)", "Tuple toString failed");
assert(1 in my_tuple, "Tuple in failed");
my_tuple;
assert(my_tuple.index(1) === 0);
assert(my_tuple.count(1) === 1);
try {
  my_tuple.push(4);
} catch (e) {}
assert(my_tuple.length === 3, "Tuple push succeeded (this is bad)");
try {
  my_tuple.pop();
} catch (e) {}
assert(my_tuple.length === 3, "Tuple pop succeeded (this is bad)");

// List tests
my_list = list([3]);
assert(my_list[0] === 3, "List construction failed");
my_list = list([3, 4, 5]);
assert(
  my_list[0] === 3 && my_list[1] === 4 && my_list[2] === 5,
  "List iterable construction failed"
);
assert(my_list.toString() === "[3, 4, 5]");
my_list.append(6);
assert(my_list[3] === 6, "List append failed");
my_list.insert(0, 1);
assert(my_list[0] === 1, "List insert failed");
my_list.extend([7, 8, 9]);
assert(
  my_list[5] === 7 && my_list[6] === 8 && my_list[7] === 9,
  "List extend failed"
);
my_list.remove(7);
assert(my_list[5] === 8 && my_list[6] === 9, "List remove failed");
my_list.reverse();
assert(my_list[0] === 9 && my_list[1] === 8 && my_list[2] === 6);
my_list.sort();
assert(my_list[0] === 1 && my_list[1] === 3 && my_list[2] === 4);
my_list.sort((reverse = true));
assert(my_list[0] === 9 && my_list[1] === 8 && my_list[2] === 6);
my_list.sort((a, b) => b - a);
assert(my_list[0] === 9 && my_list[1] === 8 && my_list[2] === 6);
my_list2 = list([tuple([1, 3]), tuple([2, 2]), tuple([3, 1])]);
my_list2.sort((a, b) => a[1] - b[1]);
assert(
  my_list2[0][0] === 3 &&
    my_list2[0][1] === 1 &&
    my_list2[1][0] === 2 &&
    my_list2[1][1] === 2 &&
    my_list2[2][0] === 1 &&
    my_list2[2][1] === 3,
  "List sort failed"
);
my_list2.clear();
assert(my_list2.length === 0, "List clear failed");
assert(my_list.index(9) === 0, "List index failed");
try {
  assert(my_list.index(0), "List index failed");
} catch (e) {}
assert(my_list.count(9) === 1, "List count failed");
assert(my_list.count(0) === 0, "List count failed");
assert(my_list.toString() === "[9, 8, 6, 5, 4, 3, 1]", "List toString failed");

// Random tests
vals = new Set();
for (let i = 0; i < 10000; i++) {
  rand = random();
  vals.add(rand);
  assert(rand >= 0 && rand <= 1, "Random.random() failed range check");
}
assert(vals.size >= 9999, "Random.random() failed uniqueness check");

vals = [];
for (i = 0; i < 1000; i++) {
  rand = randint(1, 10);
  vals.push(rand);
  assert(rand >= 1 && rand <= 10, "Random.randint() failed range check");
}
assert(
  1 in vals &&
    2 in vals &&
    3 in vals &&
    4 in vals &&
    5 in vals &&
    6 in vals &&
    7 in vals &&
    8 in vals &&
    9 in vals &&
    10 in vals &&
    vals.length === 1000,
  "Random.randint() failed uniqueness check"
);
selection = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
for (let i = 0; i < 1000; i++) {
  rand = choice(selection);
  assert(selection.includes(rand), "Random.choice() failed");
}
for (let i = 0; i < 1000; i++) {
  rand = uniform(9, 10);
  assert(rand >= 9 && rand <= 10, "Random.uniform() failed");
}
for (let i = 0; i < 1000; i++) {
  rand = randrange(10, 20);
  assert(rand >= 10 && rand < 20, "Random.randrange() failed");
}
for (let i = 0; i < 1000; i++) {
  rand = randrange(10, 20, 2);
  assert(
    rand >= 10 && rand < 20 && rand % 2 === 0,
    "Random.randrange() failed"
  );
}
for (let i = 0; i < 1000; i++) {
  rand = randrange(20);
  assert(rand >= 0 && rand < 20, "Random.randrange() failed");
}
seed(1);
vals = [];
for (i = 0; i < 10; i++) {
  vals.push(randint(1, 10000));
}
comps = [1194, 9002, 2501, 4359, 2659, 769, 9622, 5289, 1100, 576];
for (let i = 0; i < 10; i++) {
  assert(vals[i] === comps[i], "Random seeding failed");
}
rand = choices(selection, 10);
comps = [5, 1, 2, 2, 8, 10, 10, 3, 9, 6];
for (let i = 0; i < 10; i++) {
  assert(rand[i] === comps[i], "Random.choices() failed");
}
rand = sample(selection, 5);
comps = [5, 8, 10, 3, 9];
for (let i = 0; i < 5; i++) {
  assert(rand[i] === comps[i], "Random.sample() failed");
}
rand = shuffle(selection);
comps = [8, 7, 5, 10, 6, 9, 4, 1, 2, 3];
for (let i = 0; i < 10; i++) {
  assert(rand[i] === comps[i], "Random.shuffle() failed");
}

// Test built-in functions
assert(abs(-1) === 1 && abs(1) === 1, "abs() failed");
assert(all([1, 2, 3, 4, 5]) === true, "all() failed");
assert(all([1, 2, 3, 4, 5, 0]) === false, "all() failed");
assert(any([1, 2, 3, 4, 5]) === true, "any() failed");
assert(any(["", [], 0]) === false, "any() failed");
assert(ascii("abc") === "abc", "ascii() failed");
assert(ascii(105) === "105", "ascii() failed");
assert(bin(10) === "1010", "bin() failed");

// bool tests
assert(bool(0) === false, "bool() failed");
assert(bool(1) === true, "bool() failed");
assert(bool("") === false, "bool() failed");
assert(bool("abc") === true, "bool() failed");
assert(bool(null) === false, "bool() failed");
assert(bool(undefined) === false, "bool() failed");
assert(bool(NaN) === false, "bool() failed");
assert(bool(Infinity) === true, "bool() failed");
assert(bool(-Infinity) === true, "bool() failed");
assert(bool(true) === true, "bool() failed");
assert(bool(false) === false, "bool() failed");
assert(bool([]) === false, "bool() failed");
assert(bool([1, 2, 3]) === true, "bool() failed");
assert(bool(dict({})) === false, "bool() failed");
assert(bool(dict({ a: 1, b: 2 })) === true, "bool() failed");

b_arr = bytearray([
  0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c,
  0x0d, 0x0e, 0x0f,
]);
assert(
  b_arr.toString() === "0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15",
  "bytearray.toString() failed"
);
str_b = bytes("test");
assert(str_b.toString() === "(116, 101, 115, 116)", "bytes.toString() failed");
num_b = bytes("123");
assert(num_b.toString() === "(49, 50, 51)", "bytes.toString() failed");
assert(callable(abs) === true, "callable() failed");
assert(callable(dict) === true, "callable() failed");
assert(callable(function () {}) === true, "callable() failed");
assert(callable(null) === false, "callable() failed");
assert(chr(97) === "a", "chr() failed");
item = { a: 1, b: 2 };
delattr(item, "a");
assert(hasattr(item, "a") === false, "delattr() failed");
assert(hasattr(item, "b") === true, "delattr() failed");
// assert(
//   dir() ==
//     "global,clearInterval,clearTimeout,setInterval,setTimeout,queueMicrotask,performance,clearImmediate,setImmediate,util,fs,os,child_process,Complex,Tuple,Random,List,Dict,FrozenSet,FileObject,abs,all,any,assert,ascii,bin,bool,breakpoint,bytearray,bytes,callable,chr,complex,delattr,dict,dir,divmod,enumerate,exec,filter,float,format,frozenset,getattr,hasattr,help,hex,input,int,isinstance,issubclass,iter,len,list,locals,map,max,min,next,oct,open,ord,pow,print,range,repr,reversed,round,set,setattr,slice,sorted,str,sum,tuple,type,zip,__import__,raise,random,my_dict,item,my_dict2,dict3,dict4,my_frozenset,my_tuple,my_list,reverse,my_list2,vals,rand,i,comps,selection,b_arr,arr,a2,str_b,num_b",
//   "dir() failed"
// );
assert(dir(item) == "b", "dir() failed");
assert(divmod(10, 3).toString() === "(3, 1)", "divmod() failed");
comps = [0, 1, 2, 3, 4, 5];
for (let [i, v] of enumerate(comps)) {
  assert(i === v, "enumerate() failed");
}
for (let [i, v] of enumerate(comps, 1)) {
  assert(i === v + 1, "enumerate() start failed");
}
comps = [1, 3, 5, 7, 9, 11];
for (let [i, v] of enumerate(comps, 1, 2)) {
  assert(i === v, "enumerate() step failed");
}
assert(
  [...enumerate(comps)].toString() ===
    "(0, 1),(1, 3),(2, 5),(3, 7),(4, 9),(5, 11)",
  "enumerate() failed"
);
assert(
  exec("let x = 5; assert(x === 5, 'exec() failed')") === undefined,
  "exec() failed"
);
items = [1, 2, 3, 4, 5];
assert(
  filter((v) => v % 2 === 0, items).toString() === "2,4",
  "filter() failed"
);
assert(float("2.3") === 2.3, "float() failed");
assert(
  format("Hello {}!, {}", "you", "How are you?") === "Hello you!, How are you?",
  "format() failed"
);
assert(getattr(item, "b") === 2, "getattr() failed");
assert(hex(511) === "1ff", "hex() failed");
assert(int("123") === 123, "int() failed");
assert(int(5.68) === 5, "int() failed");
assert(int("010011", 2) === 19, "int() failed");
assert(int("0x11", 16) === 17, "int() failed");
assert(isinstance(5, Number) === true, "isinstance() failed");
assert(isinstance(5, String) === false, "isinstance() failed");
assert(isinstance({ a: 1 }, Object) === true, "isinstance() failed");
assert(isinstance({ a: 1 }, Number) === false, "isinstance() failed");
assert(isinstance("abc", String) === true, "isinstance() failed");
assert(isinstance(tuple([1, 2]), Tuple) === true, "isinstance() failed");
assert(isinstance(tuple([1, 2]), List) === false, "isinstance() failed");
assert(issubclass(5, Number) === false, "issubclass() failed");
assert(issubclass(Tuple, Array) === true, "issubclass() failed");
assert(issubclass(Tuple, List) === false, "issubclass() failed");
assert(issubclass(Tuple, Object) === true, "issubclass() failed");
items_iter = iter(items);
assert(next(items_iter) === 1, "iter() failed");
assert(next(items_iter) === 2, "iter() failed");
assert(next(items_iter) === 3, "iter() failed");
assert(next(items_iter) === 4, "iter() failed");
assert(next(items_iter) === 5, "iter() failed");
try {
  next(items_iter);
  assert(false, "iter() failed");
} catch (e) {
  assert(e.message === "StopIteration", "iter() failed");
}
assert(len(items) === 5, "len() failed");
assert(map((v) => v * 2, items).toString() === "2,4,6,8,10", "map() failed");
assert(max(items) === 5, "max() failed");
assert(min(items) === 1, "min() failed");
assert(oct(511) === "777", "oct() failed");

// open() tests
f = open("test.txt", "w+");
assert(isinstance(f, FileObject), "open() construction failed");
assert(f.read() === "", "open() blank file creation failed");
f.write("Hello World!\n");
assert(f.read() === "Hello World!\n", "open().write() failed");
f.writelines(["There\n", "is\n", "a\n", "cat\n"]);
assert(
  f.read() === "Hello World!\nThere\nis\na\ncat\n",
  "open().writelines() failed"
);
lines = f.readlines();
assert(lines[0] === "Hello World!\n", "open().readlines() failed");
assert(f.readline(1) === "There\n", "open().readline() failed");
assert(f.splitlines()[0] === "Hello World!", "open().splitlines() failed");
f.truncate(5);
assert(f.read() === "Hello", "open().truncate() failed");
f.close();
assert(f.open === false, "open().close() failed");
f.open = true;
assert(f.open === false, "open().close() freeze failed");
try {
  f.read();
  assert(false, "open().read() failed");
} catch (e) {
  assert(e.message === "File is closed", "open().read() failed");
}
fs.unlinkSync("test.txt");

// more tests
assert(ord("a") === 97, "ord() failed");
assert(pow(2, 3) === 8, "pow() failed");

//range tests
assert([...range(5)] == "0,1,2,3,4", "range() failed");
for (let [i, v] of enumerate(range(5))) {
  assert(i === v, "range() failed");
}
assert([...range(5, 10)].toString() === "5,6,7,8,9", "range() failed");
assert([...range(5, 10, 2)].toString() === "5,7,9", "range() failed");
assert([...range(10, 5, -1)].toString() === "10,9,8,7,6", "range() failed");
assert([...range(10, 5, -2)].toString() === "10,8,6", "range() failed");

assert(repr(items) === "'1,2,3,4,5'", "repr() failed");
assert(repr("Hello World!") === "'Hello World!'", "repr() failed");

arr = [1, 2, 3, 4, 5];
assert(reversed(arr).toString() === "5,4,3,2,1", "reversed() failed");
assert(arr.toString() === "1,2,3,4,5", "reversed() failed");
assert(round(5.5) === 6, "round() failed");
assert(round(5.4) === 5, "round() failed");
assert(round(3.1415926, 2) === 3.14, "round() failed");
assert(round(3.1415926, 3) === 3.142, "round() failed");
assert(round(3.1415926, 4) === 3.1416, "round() failed");
assert(round(3.1415926, 5) === 3.14159, "round() failed");
assert(round(3.1415926, 6) === 3.141593, "round() failed");
assert(round(3.1415926, 7) === 3.1415926, "round() failed");
assert(round(3.1415926, 8) === 3.1415926, "round() failed");

my_set = set([1, 2, 3, 4, 5]);
assert(isinstance(my_set, Set), "set() failed");
assert([...my_set].toString() === "1,2,3,4,5", "set() failed");

setattr(item, "a", 1);
assert(item.a === 1, "setattr() failed");
assert(slice([1, 2, 3, 4, 5], 1, 3).toString() === "2,3", "slice() failed");
assert(slice([1, 2, 3, 4, 5], 1, 3, 2).toString() === "2", "slice() failed");

randomList = [3, 9, 1, 8, 2, 7, 5, 4, 6];
assert(
  sorted(randomList).toString() === "1,2,3,4,5,6,7,8,9",
  "sorted() failed"
);
assert(
  sorted(randomList, (a, b) => b - a).toString() === "9,8,7,6,5,4,3,2,1",
  "sorted() failed"
);
assert(
  sorted(randomList, true).toString() === "9,8,7,6,5,4,3,2,1",
  "sorted() failed"
);
assert(
  sorted(randomList, false).toString() === "1,2,3,4,5,6,7,8,9",
  "sorted() failed"
);

assert(str(items) === "[ 1, 2, 3, 4, 5 ]", "str() failed");
assert(str("Hello World!") === "Hello World!", "str() failed");
assert(str(1.2345) === "1.2345", "str() failed");

assert(sum(items) === 15, "sum() failed");
assert(type(42) === "number", "type() failed");

assert(
  list(zip(items, items)).toString() ===
    "[(1, 1), (2, 2), (3, 3), (4, 4), (5, 5)]",
  "zip() failed"
);

try {
  raise(new Error("Test Exception"));
  assert(false, "raise() failed");
} catch (e) {
  assert(e.message === "Test Exception", "raise() failed");
}

// Itertools tests
assert(
  list(accumulate([1, 2, 3, 4, 5], (a, b) => a + b)).toString() ===
    "[1, 3, 6, 10, 15]",
  "accumulate() failed"
);
assert(
  list(chain([1, 2, 3], [4, 5, 6], [7, 8, 9])).toString() ===
    "[1, 2, 3, 4, 5, 6, 7, 8, 9]",
  "chain() failed"
);
assert(
  list(combinations([1, 2, 3, 4, 5], 3)).toString() ===
    "[(1, 2, 3), (1, 2, 4), (1, 2, 5), (1, 3, 4), (1, 3, 5), (1, 4, 5), (2, 3, 4), (2, 3, 5), (2, 4, 5), (3, 4, 5)]",
  "combinations() failed"
);
assert(
  list(combinations_with_replacement("abc", 2)).toString() ===
    "[(a, a), (a, b), (a, c), (b, a), (b, b), (b, c), (c, a), (c, b), (c, c)]",
  "combinations_with_replacement() failed"
);
assert(
  list(compress("abcdef", [1, 0, 1, 0, 1, 1])).toString() === "[a, c, e, f]",
  "compress() failed"
);

const my_count = count(1, 2);
for (let i = 1; i < 10; i += 2) {
  assert(next(my_count) === i, "count() failed");
}

comps = ["a", "b", "c", "a", "b", "c", "a", "b", "c", "a"];
const my_cycle = cycle("abc");
for (let i = 0; i < 10; i++) {
  assert(next(my_cycle) === comps[i], "cycle() failed");
}

assert(
  list(pairwise("ABCDEFG")).toString() ===
    "[(A, B), (B, C), (C, D), (D, E), (E, F), (F, G)]",
  "pairwise() failed"
);

assert(
  list(dropwhile((x) => x < 5, [1, 4, 6, 4, 1])).toString() === "[6, 4, 1]",
  "dropwhile() failed"
);
assert(
  list(filterfalse((x) => x % 2, range(10))).toString() === "[0, 2, 4, 6, 8]",
  "filterfalse() failed"
);

assert(
  listComp(groupby("AAAABBBCCDAABBB"), (x) => x[0]).toString() ===
    "A,B,C,D,A,B",
  "groupby() failed"
);
assert(
  listComp(groupby("AAAABBBCCD"), (x) => list(x[1])).toString() ===
    "[A, A, A, A],[B, B, B],[C, C],[D]",
  "groupby() failed"
);

assert(list(islice("ABCDEFG", 2)).toString() === "[A, B]", "islice() failed");
assert(
  list(islice("ABCDEFG", 2, 4)).toString() === "[C, D]",
  "islice() failed"
);
assert(
  list(islice("ABCDEFG", 2, null)).toString() === "[C, D, E, F, G]",
  "islice() failed"
);
assert(
  list(islice("ABCDEFG", 2, null, 2)).toString() === "[C, E, G]",
  "islice() failed"
);

assert(
  list(permutations("ABCD", 2)).toString() ===
    "[(A, B), (A, C), (A, D), (B, A), (B, C), (B, D), (C, A), (C, B), (C, D), (D, A), (D, B), (D, C)]",
  "permutations() failed"
);
assert(
  list(permutations(range(3))).toString() ===
    "[(0, 1, 2), (0, 2, 1), (1, 0, 2), (1, 2, 0), (2, 0, 1), (2, 1, 0)]",
  "permutations() failed"
);

assert(
  list(product(1, "ABCDE", "xy")).toString() ===
    "[(A, x), (A, y), (B, x), (B, y), (C, x), (C, y), (D, x), (D, y), (E, x), (E, y)]",
  "product() failed"
);
assert(
  list(product(3, range(2))).toString() ===
    "[(0, 0, 0), (0, 0, 1), (0, 1, 0), (0, 1, 1), (1, 0, 0), (1, 0, 1), (1, 1, 0), (1, 1, 1)]",
  "product() failed"
);

assert(list(repeat(10, 3)).toString() === "[10, 10, 10]", "repeat() failed");
assert(
  list(
    starmap(pow, [
      [2, 5],
      [3, 2],
      [10, 3],
    ])
  ).toString() === "[32, 9, 1000]",
  "starmap() failed"
);
assert(
  list(takewhile((x) => x < 5, [1, 4, 6, 4, 1])).toString() === "[1, 4]",
  "takewhile() failed"
);

const t = tee(iter("ABCDEFG"));
assert(list(t[0]).toString() === "[A, B, C, D, E, F, G]", "tee() failed");
assert(list(t[1]).toString() === "[A, B, C, D, E, F, G]", "tee() failed");

assert(
  list(zip_longest("-", "ABCD", "xy")).toString() ===
    "[(A, x), (B, y), (C, -), (D, -)]",
  "zip_longest() failed"
);

print("All tests passed");
