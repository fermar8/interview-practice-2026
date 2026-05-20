// The map() method of Array instances creates a new array populated with 
// the results of calling a provided function on every element in the calling array

const numbers: number[] = [1, 2, 3, 4, 5];

const squaredNumbers: number[] = numbers.map((num) => num * num);

console.log(squaredNumbers); // Output: [1, 4, 9, 16, 25]

// The filter() method of Array instances creates a shallow copy of 
// a portion of a given array, filtered down to just the elements from 
// the given array that pass the test implemented by the provided function.

const getEvenNumbers: number[] = numbers.filter((num) => num % 2 === 0);

console.log(getEvenNumbers); // Output: [2, 4]

// The reduce() method of Array instances executes a reducer function
// on each element of the array, resulting in a single output value.

const sum: number = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

console.log(sum); // Output: 15

// it can also be used with an initial value, which is the second argument to reduce().

const sumWithInitialValue: number = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 1);

console.log(sumWithInitialValue); // Output: 16

// The forEach() method executes a provided function once for each array element.

numbers.forEach((num) => console.log(num)); // Output: 1 2 3 4 5

// The find() method returns the value of the first element in the provided array that satisfies the provided testing function.

const foundNumber: number | undefined = numbers.find((num) => num > 3);

console.log(foundNumber); // Output: 4

// The findIndex() method returns the index of the first element in the array that satisfies the provided testing function.

const foundIndex: number = numbers.findIndex((num) => num > 3);

console.log(foundIndex); // Output: 3

// The some() method tests whether at least one element in the array passes the test implemented by the provided function.

const hasEvenNumber: boolean = numbers.some((num) => num % 2 === 0);

console.log(hasEvenNumber); // Output: true

// The every() method tests whether all elements in the array pass the test implemented by the provided function.   

const allEvenNumbers: boolean = numbers.every((num) => num % 2 === 0);
console.log(allEvenNumbers); // Output: false

// The includes() method determines whether an array includes a certain value among its entries, returning true or false as appropriate.
const includesThree: boolean = numbers.includes(3);
console.log(includesThree); // Output: true

const includesTen: boolean = numbers.includes(10);
console.log(includesTen); // Output: false  

// The sort() method sorts the elements of an array in place and returns the sorted array.
const sortedNumbers: number[] = numbers.sort((a, b) => a - b);
console.log(sortedNumbers); // Output: [1, 2, 3, 4, 5]  

