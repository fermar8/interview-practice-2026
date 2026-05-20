// Redis is an in-memory data structure store that can be used as a database, cache, and message broker.
// It supports various data structures such as strings, hashes, lists, sets, and sorted sets.
// Redis is often used for caching because it is extremely fast and can handle a large number of read and 
// write operations per second.
// It can be used to cache frequently accessed data, such as user sessions, product information,
//  or API responses, to reduce the load on the primary database and improve the performance of the application.

// To use Redis in a Node.js application, we can use the `redis` package, which provides a client for 
// connecting to a Redis server and performing operations on it.

import { createClient } from "redis";

const redisClient = createClient();
redisClient.on("error", (err) => console.error("Redis Client Error", err));

async function main() {
  await redisClient.connect();
    await redisClient.set("key", "value");
  const value = await redisClient.get("key");
  console.log(value); // Output: "value"
  await redisClient.quit();
}

main();

// In this example, we create a Redis client, connect to the Redis server, set a key-value pair, 
// retrieve the value for the key, and then quit the client.
// We can also use Redis to implement caching in our application. For example, 
// we can cache the results of a database query to improve performance.

// For example, we can check if the data is already in the cache before querying the database.
async function getData(key: string) {
  // Check if the data is in the cache
  const cachedData = await redisClient.get(key);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // If the data is not in the cache, query the database
  const data = await queryDatabase(key);

  // Store the data in the cache for future requests
  await redisClient.set(key, JSON.stringify(data));

  return data;
}

// Mock function to simulate a database query
async function queryDatabase(key: string) {
  // Simulate a delay for the database query
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { key, value: "Some data from the database" };
}

// For cache invalidation, we can set an expiration time for the cached data using the 
// `EX` option when setting a key-value pair in Redis.
async function getDataWithExpiration(key: string) {
  // Check if the data is in the cache
  const cachedData = await redisClient.get(key);
  if (cachedData) {
    return JSON.parse(cachedData);
  }
} // If the data is not in the cache, query the database

// read-heavy endpoints can benefit greatly from caching, as it can significantly reduce the 
// response time and the load on the database.

