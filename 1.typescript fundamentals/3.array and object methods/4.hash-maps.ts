// hash maps are a data structure that allows us to store key-value pairs.
// They are also known as hash tables or dictionaries in other programming languages.
// In JavaScript and TypeScript, we can use the built-in Map object to create a hash map.

// A Map is a collection of key-value pairs where the keys can be of any type, 
// and the values can also be of any type. 
// The Map object provides methods for adding, removing, and retrieving key-value pairs.

const myMap = new Map<string, number>();
myMap.set("one", 1);
myMap.set("two", 2);
myMap.set("three", 3);

console.log(myMap.get("two")); // Output: 2
console.log(myMap.has("three")); // Output: true
myMap.delete("one");
console.log(myMap.has("one")); // Output: false 


// We would use Map vs Object when we need to maintain the order of the key-value pairs,
// when we need to use keys that are not strings or symbols, 
// or when we need to store a large number of key-value pairs 
// and want better performance for lookups and insertions.
// it is more performant because it uses a hash function to compute 
// the index of the key-value pair in the underlying data structure,
// which allows for faster lookups and insertions compared to an object, 
// which uses a linear search to find the key-value pair.
// A hash function is a function that takes an input (or "key") 
// and returns a fixed-size string of bytes.