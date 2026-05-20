// A promise represents the eventual result of an asynchronous operation.
// It can resolve successfully with a value or reject with an error. 
// TypeScript enhances this by letting you declare what type of value the promise will return.

const myPromise: Promise<string> = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve("Hello, world!");
  }, 1000);
});

myPromise.then((message) => {
  console.log(message); // TypeScript knows that message is a string
}).catch((error) => {
    console
});

// A promise has three states:
// Pending – the operation is still running
// Fulfilled – the operation succeeded
// Rejected – the operation failed

// You resolve a promise using resolve() and reject it using reject():
const getAgeOver18 = (): Promise<number> => {
    return new Promise((resolve, reject) => {
        const age = Math.floor(Math.random() * 100);
        if (age >= 18) {
            resolve(age); // The promise is fulfilled with the age value
        } else {
            reject(new Error("Underage")); // The promise is rejected with an error
            // Pass an Error object to reject: Always use new Error() when calling reject. 
            // It preserves the stack trace, making debugging much easier.
        }
    });
};

getAgeOver18().then((age) => {
    console.log(`You are ${age} years old.`);
}).catch((error) => {
    console.error(error.message);
});

