import "@testing-library/jest-dom";

import { TextDecoder, TextEncoder } from "node:util";

Object.defineProperty(globalThis, "TextEncoder", {
  value: TextEncoder,
  writable: true,
  configurable: true,
});

Object.defineProperty(globalThis, "TextDecoder", {
  value: TextDecoder,
  writable: true,
  configurable: true,
});

afterAll(async () => {
  const { closeDatabasePool } = await import("./app/db/postgres");
  await closeDatabasePool();
});
