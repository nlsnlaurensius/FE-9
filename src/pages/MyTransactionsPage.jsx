import React, { useState, useEffect } from 'react';
import { getAllTransactions } from '../api';
import { useNavigate, Navigate } from 'react-router-dom';

function MyTransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || !user.id) {
        setMessage('User not logged in. Redirecting...');
        setMessageType('error');
        navigate('/login');
        return;
    }

    const fetchTransactions = async () => {
      try {
        const response = await getAllTransactions();
        if (response.data.success) {
            const userTransactions = response.data.payload.filter(t => t.user_id === user.id);
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
        if (error.response && error.response.status === 401) {
             localStorage.removeItem('token');
             localStorage.removeItem('user');
             navigate('/login');
        }
      }
    };
    fetchTransactions();
  }, [navigate, user]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md dark:shadow-lg transition-colors duration-300">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">My Transactions</h2>
      {message && <p className={`mb-4 ${messageType === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{message}</p>}

      {transactions.length > 0 ? (
         transactions.map(t => (
            <div key={t.id} className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-sm dark:shadow-md mb-4 border border-gray-200 dark:border-gray-600 transition-colors duration-300 text-gray-700 dark:text-gray-300">
                <p className="text-sm mb-1"><strong>Transaction ID:</strong> {t.id}</p>
                <p className="text-sm mb-1"><strong>Item:</strong> {t.item.name}</p>
                <p className="text-sm mb-1"><strong>Quantity:</strong> {t.quantity}</p>
                <p className="text-sm mb-1"><strong>Total:</strong> ${parseFloat(t.total).toFixed(2)}</p>
                <p className="text-sm mb-1"><strong>Status:</strong> <span className={`font-semibold ${t.status === 'paid' ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'}`}>{t.status}</span></p>
                <p className="text-sm"><strong>Date:</strong> {new Date(t.created_at).toLocaleString()}</p>
            </div>
         ))
      ) : (
        <p className="text-gray-600 dark:text-gray-300 text-center">No transactions found yet.</p>
      )}
    </div>
  );
}

export default MyTransactionsPage;
