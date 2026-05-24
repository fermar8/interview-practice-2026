# Redis Basics

## What Redis Is

Redis is an in-memory data structure store that can be used as:

- Database
- Cache
- Message broker

It supports structures like:

- Strings
- Hashes
- Lists
- Sets
- Sorted sets

## Why Redis Is Common for Caching

Redis is very fast and can handle high read/write throughput.

Typical cache targets:

- User sessions
- Product data
- API responses

This reduces load on the primary database and improves response times.

## Node.js Usage Example

```ts
import { createClient } from "redis";

const redisClient = createClient();
redisClient.on("error", (err) => console.error("Redis Client Error", err));

async function main() {
  await redisClient.connect();
  await redisClient.set("key", "value");
  const value = await redisClient.get("key");
  console.log(value); // "value"
  await redisClient.quit();
}

main();
```

## Read-Through Cache Pattern

```ts
async function getData(key: string) {
  const cachedData = await redisClient.get(key);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  const data = await queryDatabase(key);
  await redisClient.set(key, JSON.stringify(data));
  return data;
}

async function queryDatabase(key: string) {
  await new Promise((resolve) => setTimeout(resolve, 100));
  return { key, value: "Some data from the database" };
}
```

## Cache Invalidation via Expiration

Set TTL when storing values (for example via Redis `EX`) to keep cache data fresh and avoid stale data buildup.

## Where Caching Helps Most

Read-heavy endpoints often gain major latency and throughput improvements with Redis caching.
