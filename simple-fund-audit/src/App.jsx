import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import TransferForm from './transfer component/Transfer'
import TransactionHistory from './transactionhist component/TransactionHistory'
import { getBalance } from './services/api'

function App() {
  const [currentUserId, setCurrentUserId] = useState(1);
  const [refreshKey, setRefreshKey] = useState(0);
  const [balance, setBalance] = useState(null);

  const fetchBalance = async () => {
    const res = await getBalance(currentUserId);
    setBalance(res.data.balance);
  };

  useEffect(() => {
    fetchBalance();
  }, [currentUserId]);


  return (
    <>
      <div className="app-container">
        <h1>Simple Transaction System</h1>

        <div className="user-section">
          <label>Current User ID</label>
          <input
            type="text"
            value={currentUserId}
            onChange={(e) => setCurrentUserId(e.target.value)}
          />
        </div>

        <div className="balance-box">
          <strong>Current Balance:</strong> ₹{balance}
        </div>


        <TransferForm senderId={currentUserId}
          onSuccess={() => {
            setRefreshKey(prev => prev + 1); // refresh history
            fetchBalance();                 // refresh balance
          }} />

        <TransactionHistory
          userId={currentUserId}
          refreshKey={refreshKey}
        />
      </div>
    </>
  )
}

export default App
