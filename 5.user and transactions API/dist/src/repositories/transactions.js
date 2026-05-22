export class TransactionRepository {
    db;
    constructor(db) {
        this.db = db;
    }
    async createTransaction(userId, amount, type) {
        const query = `INSERT INTO transactions (userId, amount, type, date) VALUES (?, ?, ?, ?)`;
        const date = new Date().toISOString();
        await new Promise((resolve, reject) => {
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
//# sourceMappingURL=transactions.js.map