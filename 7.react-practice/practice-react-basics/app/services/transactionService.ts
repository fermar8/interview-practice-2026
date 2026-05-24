import type { Transaction } from "~/models/transactions";

export async function getTransactions(): Promise<Transaction[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("Transactions fetched");
            resolve([
            { id: 1, amount: 100, date: "2024-06-01", type: "withdrawal" },
                { id: 2, amount: 200, date: "2024-06-02", type: "deposit" },
        { id: 3, amount: 300, date: "2024-06-03", type: "withdrawal" },
        { id: 4, amount: 400, date: "2024-06-04", type: "deposit" },
        { id: 5, amount: 500, date: "2024-06-05", type: "withdrawal" },
        { id: 6, amount: 600, date: "2024-06-06", type: "deposit" },
        { id: 7, amount: 700, date: "2024-06-07", type: "withdrawal" },
        { id: 8, amount: 800, date: "2024-06-08", type: "deposit" },
        { id: 9, amount: 900, date: "2024-06-09", type: "withdrawal" },
        { id: 10, amount: 1000, date: "2024-06-10", type: "deposit" }
    ]);
    }, 1000)
})};