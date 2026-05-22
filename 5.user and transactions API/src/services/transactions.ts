import sqlite3 from "sqlite3";
import { TransactionRepository } from "../repositories/transactions.js";

export class TransactionService {
    private transactionRepository: TransactionRepository;

    constructor(db: sqlite3.Database) {
        this.transactionRepository = new TransactionRepository(db);
    }

    async createTransaction(userId: number, amount: number, type: 'deposit' | 'withdrawal' | 'bet'): Promise<void> {
        await this.transactionRepository.createTransaction(userId, amount, type);
    }
} 