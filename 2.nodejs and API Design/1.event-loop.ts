//The Event Loop is the core mechanism that allows single-threaded environments to 
// perform non-blocking, asynchronous operations. 
// It constantly monitors your code execution and schedules tasks efficiently.

// The event loop coordinates several architectural components:
// 1. Call Stack: Executes synchronous code sequentially (one thing at a time).
// 2. Web APIs / Background: Handles long-running tasks (like network requests or timers) outside the main thread.
// 3. Task Queues: Stores callbacks from finished background tasks, split into Macrotasks (e.g., setTimeout) and Microtasks (e.g., Promises).
// 4. The Loop: Checks if the Call Stack is empty. If it is, it pushes the next waiting callback from the queue into the stack.

// Example to illustrate the event loop:
// Output:  
// Start
// End
// Promise callback
// Timeout callback
// Explanation:
// 1. "Start" is logged immediately.
// 2. setTimeout is called, and its callback is sent to the Macrotask queue.
// 3. Promise.resolve() is called, and its callback is sent to the Microtask queue.
// 4. "End" is logged immediately after "Start".
// 5. The event loop checks the Call Stack, finds it empty, and processes the Microtask queue first, logging "Promise callback".
// 6. Finally, it processes the Macrotask queue, logging "Timeout callback".

console.log("Start");
setTimeout(() => {
  console.log("Timeout callback");
}, 0);

Promise.resolve().then(() => {
  console.log("Promise callback");
});
console.log("End");

// Event Loop Starvation: This happens when you run heavy CPU-intensive synchronous code 
// (like a massive for loop or large JSON parsing) on the main thread. 
// A synchronous task is blocking, while an asynchronous task is non-blocking, 
// meaning it allows other tasks to run while waiting for completion.
// It completely freezes the event loop, meaning no other user requests can be processed.


// If my Node.js application is freezing because of heavy CPU calculations, 
// I will use Worker Threads to move that work off the main event loop. 
// If my application is struggling to handle a high volume of incoming HTTP traffic, 
// I will use PM2/Cluster to utilize all CPU cores.