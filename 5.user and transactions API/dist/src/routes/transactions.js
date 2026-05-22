import { CreateTransaction } from '../models/transactions.js';
import { TransactionService } from '../services/transactions.js';
export function registerTransactionRoutes(server) {
    const transactionService = new TransactionService(server.db);
    server.post('/transaction', {
        schema: {
            body: CreateTransaction,
            response: {
                200: CreateTransaction
            },
        },
    }, async (request, reply) => {
        const transactionService = new TransactionService(request.server.db);
        const { amount, type } = request.body;
        await transactionService.createTransaction(/* userId */ 1, amount, type);
        reply.status(200).send({ amount, type });
    });
}
;
//# sourceMappingURL=transactions.js.map