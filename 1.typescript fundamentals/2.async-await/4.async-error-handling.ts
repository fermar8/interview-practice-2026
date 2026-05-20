// In promises, you can handle errors using the .catch method.
// If any error occurs in the promise chain, it will be caught by the nearest .catch.

const aPromise: Promise<string> = new Promise((resolve, reject) => {
  setTimeout(() => {    
    reject(new Error("Something went wrong!"));
  }, 1000);
});

aPromise.then((message) => {
  console.log(message);
}).catch((error) => {
  console.error("Caught an error:", error.message);
});

// In async/await, you can handle errors using try/catch blocks.

async function asyncFunctionExample (): Promise<void> {
  try {
    const result = await aPromise;
    console.log(result);
  } catch (error) {
    console.error("Caught an error in async function:", (error as Error).message);
  }
}