export type Transaction = {
  id: number;
  date: string;
  amount: number;
  type: "withdrawal" | "deposit";
}