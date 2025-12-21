import pool from "../connectDB.js";

export const transfer = async (req, res) => {
    const senderId = parseInt(req.body.senderId);
    const receiverId = parseInt(req.body.receiverId);
    const amount = req.body.amount;

    // if (!senderId || !receiverId || isNaN(transferAmount) || transferAmount <= 0) {
    //     return res.status(400).json({
    //         message: "Invalid input! Please enter all the details"
    //     });
    // }

    if (!senderId || !receiverId) {
        return res.status(400).json({
            message: "Invalid sender or receiver"
        });
    }

    const amountRegex = /^\d+(\.\d{1,2})?$/;

    if (!amountRegex.test(amount)) {
        return res.status(400).json({
            message: "Amount must be a valid numeric value"
        });
    }

    const transferAmount = parseFloat(amount);

    if (transferAmount <= 0) {
        return res.status(400).json({
            message: "Amount must be greater than zero"
        });
    }

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        const senderRes = await client.query(
            "SELECT balance FROM users WHERE id = $1 FOR UPDATE",
            [senderId]
        );

        if (senderRes.rows.length === 0) {
            throw new Error("Sender not found");
        }

        const senderBal = parseFloat(senderRes.rows[0].balance);

        if (senderBal < transferAmount) {
            throw new Error("Insufficient balance");
        }

        const receiverRes = await client.query(
            "SELECT id FROM users WHERE id = $1",
            [receiverId]
        );

        if (receiverRes.rows.length === 0) {
            throw new Error("Receiver not found");
        }

        await client.query(
            "UPDATE users SET balance = balance - $1 WHERE id = $2",
            [transferAmount, senderId]
        );

        await client.query(
            "UPDATE users SET balance = balance + $1 WHERE id = $2",
            [transferAmount, receiverId]
        );

        await client.query(
            "INSERT INTO transactions (sender_id, receiver_id, amount, status) VALUES ($1, $2, $3, $4)",
            [senderId, receiverId, transferAmount, "SUCCESS"]
        );

        await client.query("COMMIT");

        return res.status(200).json({
            message: "Transfer successful"
        });

    } catch (err) {
        await client.query("ROLLBACK");

        return res.status(400).json({
            message: err.message || "Transaction failed"
        });
    } finally {
        client.release();
    }
};



export const getTransactionHist = async (req, res) => {
  const { userId } = req.params;
  const order = req.query.order === "asc" ? "ASC" : "DESC";

  try {
    const result = await pool.query(
      `SELECT id, sender_id, receiver_id, amount, status, created_at
       FROM transactions
       WHERE sender_id = $1 OR receiver_id = $1
       ORDER BY created_at ${order}`,
      [userId]
    );

    return res.status(200).json({
      transactions: result.rows,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch transactions",
    });
  }
};



export const getBalance = async (req, res) => {
  const { userId } = req.params;

  try {
    const result = await pool.query(
      "SELECT balance FROM users WHERE id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      balance: result.rows[0].balance,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Failed to fetch balance",
    });
  }
};






// await client.query(
//   "INSERT INTO transactions (sender_id, receiver_id, amount, status) VALUES ($1, $2, $3, $4)",
//   [senderId, receiverId, transferAmount, "FAILED"]