import { useState, useEffect, useMemo } from "react";
import { getTransactions } from "~/services/transactionService";
import type { Transaction } from "~/models/transactions";

export default function Practice() {
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentId, setCurrentId] = useState<number | null>(null);

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

  // Search / filter
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");

  const handleTransactionClick = (id: number) => {
    setCurrentId(id);
  };

  useEffect(() => {
    async function fetchTransactions(): Promise<void> {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error: unknown) {
        setErrorMessage("Failed to fetch transactions");
      } finally {
        setLoading(false);
      }
    }

    fetchTransactions();
  }, []);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    // This function is called whenever transactions, searchTerm, or selectedType changes.
    // it filters the transactions based on the search term and selected type.
    // It checks if the transaction type or date includes the search term and if the transaction type matches the selected type (or if "all" is selected).
    // The result is a new array of transactions that match the criteria, which is then used for pagination and display.
    return transactions.filter((transaction) => {
      const matchesSearch =
        transaction.type
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        transaction.date.includes(searchTerm);

      const matchesType =
        selectedType === "all" ||
        transaction.type.toLowerCase() === selectedType.toLowerCase();

      return matchesSearch && matchesType;
    });
  }, [transactions, searchTerm, selectedType]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / pageSize);

  const paginatedTransactions = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return filteredTransactions.slice(start, end);
  }, [filteredTransactions, page]);

  // Reset to first page when filters change
  useEffect(() => {
    setPage(1);
  }, [searchTerm, selectedType]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Transaction Dashboard</h1>

      {/* Search */}
      <input
        type="text"
        placeholder="Search by type or date..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{
          padding: "8px",
          marginRight: "10px",
          marginBottom: "10px",
        }}
      />

      {/* Filter */}
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        style={{
          padding: "8px",
          marginBottom: "10px",
        }}
      >
        <option value="all">All</option>
        <option value="deposit">Deposit</option>
        <option value="withdrawal">Withdrawal</option>
      </select>

      {/* Loading */}
      {loading && <p>Loading...</p>}

      {/* Error */}
      {errorMessage && <p>{errorMessage}</p>}

      {/* Transactions */}
      {!loading && !errorMessage && (
        <>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {paginatedTransactions.map((transaction) => (
              <li
                key={transaction.id}
                onClick={() => handleTransactionClick(transaction.id)}
                style={{
                  cursor: "pointer",
                  padding: "10px",
                  marginBottom: "8px",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  fontWeight:
                    transaction.id === currentId ? "bold" : "normal",
                  backgroundColor:
                    transaction.id === currentId ? "#f3f3f3" : "white",
                }}
              >
                <p>
                  <strong>Date:</strong> {transaction.date}
                </p>

                <p>
                  <strong>Type:</strong> {transaction.type}
                </p>

                <p>
                  <strong>Amount:</strong> ${transaction.amount}
                </p>
              </li>
            ))}
          </ul>

          {/* Empty state */}
          {paginatedTransactions.length === 0 && (
            <p>No transactions found.</p>
          )}

          {/* Pagination */}
          <div style={{ marginTop: "20px" }}>
            <button
              disabled={page === 1}
              onClick={() => setPage((prev) => prev - 1)}
              style={{ marginRight: "10px" }}
            >
              Previous
            </button>

            <span>
              Page {page} of {totalPages || 1}
            </span>

            <button
              disabled={page >= totalPages}
              onClick={() => setPage((prev) => prev + 1)}
              style={{ marginLeft: "10px" }}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}