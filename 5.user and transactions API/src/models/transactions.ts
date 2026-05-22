import { Static, Type } from 'typebox';

export const Transaction= Type.Object({
    id: Type.Number(),
    userId: Type.Number(),
    amount: Type.Number(),
    type: Type.Union([Type.Literal('deposit'), Type.Literal('withdrawal'), Type.Literal('bet')]),
    date: Type.String({ format: 'date-time' })
});

export type TransactionType = Static<typeof Transaction>;
export const CreateTransaction = Type.Omit(Transaction, ['id', 'userId', 'date']);
export type CreateTransactionType = Static<typeof CreateTransaction>;