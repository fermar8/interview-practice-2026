import { FastifyInstance } from 'fastify';
import { IHeaders, IQuerystring, IReply } from "../models/fastify.js";
import { CreateTransaction, CreateTransactionType } from '../models/transactions.js';
import { TransactionService } from '../services/transactions.js';

export function registerTransactionRoutes(server: FastifyInstance): void {
  const transactionService = new TransactionService(server.db);
  server.post<{
    Querystring: IQuerystring,
    Headers: IHeaders,
    Body: CreateTransactionType,
    Reply: CreateTransactionType | IReply['4xx']
  }>('/transaction', 
    {
    schema: {
      body: CreateTransaction,
      response: {
        200: CreateTransaction
      },
    },
  },
  async (request, reply) => {
    const transactionService = new TransactionService(request.server.db);
    const { amount, type } = request.body;
    await transactionService.createTransaction(/* userId */ 1, amount, type);
    reply.status(200).send({ amount, type });
  });
};