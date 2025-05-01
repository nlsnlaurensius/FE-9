import React, { useState, useEffect } from 'react';
import { getAllTransactions } from '../api';
import { useNavigate } from 'react-router-dom';

function MyTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();
  // Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || !user.id) {
        // Should be caught by PrivateRoute, but good practice to check
        setMessage('User not logged in. Redirecting...');
        setMessageType('error');
        navigate('/');
        return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await getAllTransactions();
        if (response.data.success) {
            // Filter transactions for the current user
            const userTransactions = response.data.payload.filter(t => t.user_id === user.id);
            // Sort by date, newest first
            userTransactions.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            setTransactions(userTransactions);
        } else {
          setMessage(response.data.message);
          setMessageType('error');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error fetching transactions.';
        console.error("API Error:", error.response || error);
        setMessage(errorMessage);
        setMessageType('error');
      }
    };
    fetchTransactions();
  }, [navigate, user]); // Depend on navigate and user

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">My Transactions</h2>
      {message && <p className={`mb-4 ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
      {transactions.length > 0 ? (
         transactions.map(t => (
            <div key={t.id} className="bg-gray-50 p-4 rounded-lg shadow-sm mb-4 border border-gray-200"> {/* Transaction Item Styling */}
                <p className="text-sm text-gray-700 mb-1"><strong>Transaction ID:</strong> {t.id}</p>
                <p className="text-sm text-gray-700 mb-1"><strong>Item:</strong> {t.item.name}</p>
                <p className="text-sm text-gray-700 mb-1"><strong>Quantity:</strong> {t.quantity}</p>
                <p className="text-sm text-gray-700 mb-1"><strong>Total:</strong> ${parseFloat(t.total).toFixed(2)}</p> {/* Format total */}
                <p className="text-sm text-gray-700 mb-1"><strong>Status:</strong> <span className={`font-semibold ${t.status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>{t.status}</span></p> {/* Highlight status */}
                <p className="text-sm text-gray-700"><strong>Date:</strong> {new Date(t.created_at).toLocaleString()}</p> {/* Format date */}
            </div>
         ))
      ) : (
        <p className="text-gray-600">No transactions found yet.</p>
      )}
    </div>
  );
}

export default MyTransactionsPage;