// You can run multiple asynchronous tasks in parallel using Promise.all
// Promise.all takes an array of promises and returns a new promise that resolves 
// when all the input promises have resolved, 
// or rejects if any of the input promises reject.
const Promise1 = Promise.resolve(1);
const Promise2 = Promise.resolve("Hello world");
const Promise3 = Promise.reject(new Error("Something went wrong"));

Promise.all([Promise1, Promise2]).then(([result1, result2]) => {
    console.log(result1); // 1
    console.log(result2); // "Hello world"
}).catch((error) => {
    console.error(error);
});

// If any of the promises reject, the entire Promise.all will reject with that error.

Promise.all([Promise1, Promise3]).then(([result1, result3]) => {
    console.log(result1); // This will not run
    console.log(result3); // This will not run
}).catch((error) => {
    console.error(error.message); // "Something went wrong"
});

// Promise.allSettled is similar to Promise.all,
// but it waits for all promises to settle (either resolve or reject) 
// and returns an array of objects describing the outcome of each promise.

Promise.allSettled([Promise1, Promise3]).then((results) => {
    results.forEach((result) => {
        if (result.status === "fulfilled") {
            console.log(`Fulfilled with value: ${result.value}`);
        } else {
            console.error(`Rejected with reason: ${result.reason.message}`);
        }   
    });
});

// Promise.any takes an array of promises and returns a new promise that resolves 
// as soon as any of the input promises resolves, 
// or rejects if all of the input promises reject.

Promise.any([Promise1, Promise3]).then((result) => {
    console.log(result); // 1, first promise to resolve
}).catch((error) => {
    console.error(error);
});

// Promise.race takes an array of promises and returns a new promise that resolves or rejects
// as soon as any of the input promises resolves or rejects.

Promise.race([Promise1, Promise3]).then((result) => {
    console.log(result); // 1, first promise to resolve
}).catch((error) => {
    console.error(error.message); // "Something went wrong", first promise to reject
});