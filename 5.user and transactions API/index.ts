import fastify from 'fastify'
import sqlite3 from 'sqlite3';
import { registerUserRoutes } from './src/routes/users.js'
import { registerTransactionRoutes } from './src/routes/transactions.js';

const server = fastify({ logger: true });

function openDatabase(path: string): Promise<sqlite3.Database> {
  return new Promise((resolve, reject) => {
    const db = new sqlite3.Database(path, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(db);
    });
  });
}

function closeDatabase(db: sqlite3.Database): Promise<void> {
  return new Promise((resolve, reject) => {
    db.close((err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

function initDatabase(db: sqlite3.Database): Promise<void> {
  const query = `
    CREATE TABLE IF NOT EXISTS transactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      userId INTEGER NOT NULL,
      amount REAL NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'bet')),
      date TEXT NOT NULL
    );
  `;

  return new Promise((resolve, reject) => {
    db.exec(query, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

server.get('/ping', async (request, reply) => {
  return 'pong\n'
});

const start = async () => {
  let db: sqlite3.Database | undefined;

  const shutdown = async (signal: string) => {
    server.log.info(`Received ${signal}. Shutting down...`);
    await server.close();
    process.exit(0);
  };

  try {
    db = await openDatabase("practice.db");
    await initDatabase(db);
    server.decorate("db", db);
    registerUserRoutes(server);
    registerTransactionRoutes(server);

    server.addHook("onClose", async () => {
      if (db) await closeDatabase(db);
    });

    await server.ready();
    console.log(server.printRoutes());

    process.once("SIGINT", () => void shutdown("SIGINT"));
    process.once("SIGTERM", () => void shutdown("SIGTERM"));

    await server.listen({ port: 3000, host: "0.0.0.0" });
  } catch (err) {
    console.error(err); // always visible
    if (db) await closeDatabase(db);
    process.exit(1);
  }
};

start();