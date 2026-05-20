// Deduplicating arrays
const array1 = [1, 2, 3, 4, 5];
const array2 = [3, 4, 5, 6, 7]; 

// Using Set to deduplicate arrays
// A Set is a collection of unique values, so when we create a new Set from the combined arrays, it automatically removes any duplicate values.
const deduplicatedArray = Array.from(new Set([...array1, ...array2]));
console.log(deduplicatedArray); // Output: [1, 2, 3, 4, 5, 6, 7]

// Frequency maps are used to count the occurrences of each element in an array.
// we use a new Map to store the frequency of each number in both arrays.
const frequencyMap = new Map<number, number>();
for (const num of array1) {
  frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
}
for (const num of array2) {
  frequencyMap.set(num, (frequencyMap.get(num) || 0) + 1);
}
console.log(frequencyMap); // Output: Map { 1 => 1, 2 => 1, 3 => 2, 4 => 2, 5 => 2, 6 => 1, 7 => 1 }   

// transformations are used to create a new array by 
// applying a function to each element of an existing array.
const transformedArray = array1.map((num) => num * 2);
console.log(transformedArray); // Output: [2, 4, 6, 8, 10]

// 1. Exercise: Group users by country.

interface User {
  name: string;
  country: string;
}

const users: User[] = [
  { name: "Alice", country: "USA" },
  { name: "Bob", country: "Canada" },
  { name: "Charlie", country: "USA" },
  { name: "David", country: "UK" },
];

const usersByCountry = new Map<string, User[]>();
for (const user of users) {
  if (!usersByCountry.has(user.country)) {
    usersByCountry.set(user.country, []);
    console.log(`Added new country: ${user.country}`);
    console.log(`Current usersByCountry Map:`, usersByCountry);
  }
  usersByCountry.get(user.country)!.push(user);
  console.log(`Added user ${user.name} to country ${user.country}`);
  console.log(`Current usersByCountry Map:`, usersByCountry);
}
console.log(usersByCountry);
// Output: Map { 'USA' => [ { name: 'Alice', country: 'USA' }, { name: 'Charlie', country: 'USA' } ], 'Canada' => [ { name: 'Bob', country: 'Canada' } ], 'UK' => [ { name: 'David', country: 'UK' } ] }

// The map, can be transformed into an object using Object.fromEntries() method, which takes an iterable of key-value pairs and returns a new object.
const usersByCountryObject = Object.fromEntries(usersByCountry);
console.log(usersByCountryObject);
// Output: { USA: [ { name: 'Alice', country: 'USA' }, { name: 'Charlie', country: 'USA' } ], Canada: [ { name: 'Bob', country: 'Canada' } ], UK: [ { name: 'David', country: 'UK' } ] }  

// It can also be transformed into an array of key-value pairs using Array.from() method, which creates a new array from an iterable object.
const usersByCountryArray = Array.from(usersByCountry);
console.log(usersByCountryArray);
// Output: [ [ 'USA', [ { name: 'Alice', country: 'USA' }, { name: 'Charlie', country: 'USA' } ] ], [ 'Canada', [ { name: 'Bob', country: 'Canada' } ] ], [ 'UK', [ { name: 'David', country: 'UK' } ] ] ]  