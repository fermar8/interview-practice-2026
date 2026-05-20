// Object manipulation

// 1. Object.assign is used to copy the values of all enumerable own properties 
// from one or more source objects to a target object. 
// It returns the target object.

const target = { a: 1, b: 2 };
const source = { b: 4, c: 5 };
const returnedTarget = Object.assign(target, source);

console.log(returnedTarget); // Output: { a: 1, b: 4, c: 5 }

// 2. Object.keys() returns an array of a given object's own enumerable property names,
// iterated in the same order that a normal loop would.
const obj = { a: 1, b: 2, c: 3 };
const keys: string[] = Object.keys(obj);
console.log(keys); // Output: ["a", "b", "c"]

// 3. Object.values() returns an array of a given object's own enumerable property values,
// in the same order as that provided by a for...in loop.
const values: number[] = Object.values(obj);
console.log(values); // Output: [1, 2, 3]

// 4. Object.entries() returns an array of a given object's own enumerable string-keyed property [key, value] pairs,
// in the same order as that provided by a for...in loop.
const entries: [string, number][] = Object.entries(obj);
console.log(entries); // Output: [["a", 1], ["b", 2], ["c", 3]] 

// 5. Object.freeze() freezes an object. A frozen object can no longer be changed;
// freezing an object prevents new properties from being added to it, 
// existing properties from being removed, and existing properties (or their enumerability, configurability, or writability) from being changed. 
// In essence the object becomes effectively immutable. 
// The method returns the frozen object.

const frozenObj = Object.freeze({ a: 1, b: 2 });
frozenObj.a = 3; // This will not change the value of a because the object is frozen
console.log(frozenObj); // Output: { a: 1, b: 2 }