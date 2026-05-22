import { TransactionRepository } from "../repositories/transactions.js";
export class TransactionService {
    transactionRepository;
    constructor(db) {
        this.transactionRepository = new TransactionRepository(db);
    }
    async createTransaction(userId, amount, type) {
        await this.transactionRepository.createTransaction(userId, amount, type);
    }
}
//# sourceMappingURL=transactions.js.map