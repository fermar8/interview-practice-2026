// The async function declaration creates a binding of a new async function to a given name. 
// The await keyword is permitted within the function body, enabling asynchronous, 
// promise-based behavior to be written in a cleaner style and avoiding the need to explicitly configure promise chains.

function resolveAfter2Seconds(): Promise<string> {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve("resolved");
        }, 2000);
    });
}

async function asyncCall(): Promise<void> {
    console.log("calling");
    const result = await resolveAfter2Seconds();
    console.log(result);
}

// Sequential asynchronous execution involves performing tasks one after another, 
// with each task starting only after the previous one has completed. 
// In JavaScript, we can use the async/await syntax to manage this. 
// Here's an example of sequential execution with fetch requests:

async function fetchSequentially() {
  try {
    const response1 = await fetch("https://randomuser.me/api/?results=10");
    const data1 = await response1.json()
    console.log("response fetch1", data1);

    const response2 = await fetch("https://randomuser.me/api/?results=9");
    const data2 = await response2.json()
    
    console.log("response fetch2", data2);
  } catch (error) {
    console.error("error fetch", error);
  }
}

fetchSequentially();

// Parallel asynchronous execution, on the other hand, 
// involves starting several tasks at once and letting them all progress simultaneously. 
// The Promise.all method in JavaScript makes this possible. 
// Here's how you can implement parallel execution:

async function fetchInParallel() {
  try {
    const fetch1 = fetch("https://randomuser.me/api/?results=10");
    const fetch2 = fetch("https://randomuser.me/api/?results=9");

    const [response1, response2] = await Promise.all([fetch1, fetch2]);
    
    const data1 = await response1.json()
    const data2 = await response2.json()
    
    console.log("response fetch1", data1);
    console.log("response fetch2", data2);
  } catch (error) {
    console.error("error fetch", error);
  }
}

fetchInParallel();