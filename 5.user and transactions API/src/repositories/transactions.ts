import sqlite3 from 'sqlite3';

export class TransactionRepository {
    constructor(private db: sqlite3.Database) {}

    async createTransaction(userId: number, amount: number, type: 'deposit' | 'withdrawal' | 'bet'): Promise<void> {
        const query = `INSERT INTO transactions (userId, amount, type, date) VALUES (?, ?, ?, ?)`;
        const date = new Date().toISOString();
        await new Promise<void>((resolve, reject) => {
            this.db.run(query, [userId, amount, type, date], (err) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    }
}