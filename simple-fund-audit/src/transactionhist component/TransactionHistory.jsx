import { useEffect, useState } from "react";
import { getTransactions } from "../services/api";
import "./transaction.css";

const TransactionHistory = ({ userId, refreshKey }) => {
    const [transactions, setTransactions] = useState([]);

    const [order, setOrder] = useState("desc");


    const fetchTransactions = async () => {
        const res = await getTransactions(userId, order);
        setTransactions(res.data.transactions);
    };

    useEffect(() => {
        fetchTransactions();
    }, [userId, order, refreshKey]);


    return (
        <div className="history-container">
            <h2>Transaction History</h2>

            <button className="sort-btn" onClick={() => setOrder(order === "desc" ? "asc" : "desc")}>
                Sort: {order === "desc" ? "Newest First" : "Oldest First"}
            </button>


            <table>
                <thead>
                    <tr>
                        <th>Sender</th>
                        <th>Receiver</th>
                        <th>Amount</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan="6">No transactions found</td>
                        </tr>
                    ) : (
                        transactions.map((txn) => (
                            <tr key={txn.id}>
                                <td>{txn.sender_id}</td>
                                <td>{txn.receiver_id}</td>
                                <td>{txn.amount}</td>
                                <td>{txn.status}</td>
                                <td>{new Date(txn.created_at).toLocaleString()}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionHistory;
