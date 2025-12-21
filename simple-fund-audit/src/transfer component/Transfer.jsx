import { useState } from "react";
import { transfer } from "../services/api";
import './transfer.css';

const TransferForm = ({ senderId, onSuccess }) => {
  // const [senderId, setSenderId] = useState("");
  const [receiverId, setReceiverId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await transfer({
        senderId,
        receiverId,
        amount,
      });

      console.log(res.data);

      setMessage(res.data.message);

      if (onSuccess) {
        onSuccess();
      }

    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Transfer failed due to server error");
      }
    }
  };

  return (
    <div className="transfer-container">
      <h2>Fund Transfer</h2>

      <form className="transfer-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Receiver ID</label>
          <input
            type="text"
            placeholder="Enter receiver user ID"
            value={receiverId}
            onChange={(e) => setReceiverId(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Amount</label>
          <input
            type="text"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          Transfer
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>

  );
};

export default TransferForm;
