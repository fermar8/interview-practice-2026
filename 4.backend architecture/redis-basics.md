# Redis Basics

## Overview
**Redis** is an in-memory data structure store that can be used as:
- Database
- Cache
- Message broker

## Key Characteristics
- Supports various data structures: strings, hashes, lists, sets, sorted sets
- Extremely fast with high throughput
- Can handle a large number of read and write operations per second

## Using Redis for Caching
Redis is often used for caching frequently accessed data:
- User sessions
- Product information
- API responses
- Reduces load on primary database
- Improves application performance

## Node.js Integration
Using the `redis` package to connect and perform operations:

```typescript
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
```

## Implementing Caching Strategy

### Check Cache Before Database
```typescript
async function getData(key: string) {
  // Check if data is in cache
  const cachedData = await redisClient.get(key);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // If not cached, query database
  const data = await queryDatabase(key);

  // Store in cache for future requests
  await redisClient.set(key, JSON.stringify(data));

  return data;
}

// Mock database query
async function queryDatabase(key: string) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { key, value: "Some data from the database" };
}
```

## Cache Invalidation
Set expiration time for cached data using the `EX` option:

```typescript
async function getDataWithExpiration(key: string) {
  // Check cache
  const cachedData = await redisClient.get(key);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Query database and cache with expiration
  const data = await queryDatabase(key);
  await redisClient.setEx(key, 3600, JSON.stringify(data)); // 1 hour expiration

  return data;
}
```

## Benefits for Read-Heavy APIs
- **Read-heavy endpoints** benefit greatly from caching
- Significantly reduces response time
- Reduces load on primary database
- Improves overall application performance
