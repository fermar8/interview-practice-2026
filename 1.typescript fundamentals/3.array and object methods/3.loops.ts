// for loop is a traditional loop that consists of three parts: 
// initialization, condition, and increment/decrement.
const numbers2 = [1, 2, 3, 4, 5];
for (let i = 0; i < numbers2.length; i++) {
  console.log(numbers2[i]); // Output: 1 2 3 4 5
}

// for...of loop is used to iterate over iterable objects 
// (like arrays, strings, maps, sets, etc.)
for (const num of numbers2) {
  console.log(num); // Output: 1 2 3 4 5
}

// for...in loop is used to iterate over the enumerable properties of an object.
// It iterates over the keys of the object, not the values.
const obj2 = { a: 1, b: 2, c: 3 };
for (const key in obj2) {
  if (obj2.hasOwnProperty("a")) { // Check if the property is an own property of the object
    console.log(`${key}: ${obj2[key as keyof typeof obj2]}`); 
    // Type assertion is used here to tell TypeScript that key is a key of obj2
  } else {
    console.log(`${key} is not an own property of obj2`);
  }
}

// while loop is used to execute a block of code as long as a specified condition is true.
let count = 0;
while (count < 5) {
  console.log(count); // Output: 0 1 2 3 4
  count++; 
}

// do...while loop is similar to a while loop, but it executes the block of code at least once before checking the condition.
let count2 = 0;
do {
  console.log(count2); // Output: 0 1 2 3 4
  count2++;
} while (count2 < 5);

// The for...of loop is generally preferred for iterating over arrays and other iterable objects, 
// while the for...in loop is more suitable for iterating over the properties of an object.
