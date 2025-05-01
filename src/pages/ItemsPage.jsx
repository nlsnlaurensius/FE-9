import React, { useState, useEffect } from 'react';
import { getAllItems, createTransaction, payTransaction } from '../api';
import { useNavigate, Navigate } from 'react-router-dom';

function ItemsPage() {
  const [items, setItems] = useState([]);
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

    const fetchItems = async () => {
      try {
        const response = await getAllItems();
        if (response.data.success) {
          setItems(response.data.payload);
        } else {
          setMessage(response.data.message);
          setMessageType('error');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.message || 'Error fetching items.';
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
    fetchItems();
  }, [navigate, user]);

  const handleBuyItem = async (item) => {
    setMessage('');
    setMessageType('');
    const quantity = 1;

    if (!user || !user.id) {
      setMessage('User not logged in. Please log in to purchase.');
      setMessageType('error');
      navigate('/login');
      return;
    }
    const user_id = user.id;

    if (item.stock < quantity) {
      setMessage('Insufficient stock for this item.');
      setMessageType('error');
      return;
    }

    try {
      const createResponse = await createTransaction({ item_id: item.id, quantity, user_id });
      if (!createResponse.data.success) {
          setMessage(createResponse.data.message);
          setMessageType('error');
          return;
      }
      const transactionId = createResponse.data.payload.id;

      const payResponse = await payTransaction(transactionId);

      if (payResponse.data.success) {
          setMessage('Purchase successful!');
          setMessageType('success');
          const response = await getAllItems();
          if (response.data.success) {
              setItems(response.data.payload);
          }
      } else {
          setMessage(payResponse.data.message);
          setMessageType('error');
      }

    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error during purchase. Please try again.';
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

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Available Items</h2>
      {message && <p className={`mb-4 ${messageType === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{message}</p>}

      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {items.length > 0 ? (
          items.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md flex flex-col dark:bg-gray-700 dark:shadow-lg transition-colors duration-300 overflow-hidden">
  
            <div className="w-full aspect-video overflow-hidden">
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gray-200 flex justify-center items-center text-gray-500 dark:bg-gray-600 dark:text-gray-400">Tidak Ada Gambar</div>
              )}
            </div>
          
            <div className="w-full p-4 flex flex-col text-left flex-1">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">{item.name}</h3>
                <p className="text-gray-600 text-sm dark:text-gray-300">Harga: ${item.price}</p>
                <p className={`text-sm ${item.stock > 0 ? 'text-gray-600 dark:text-gray-300' : 'text-red-600 dark:text-red-400'}`}>Stok: {item.stock}</p>
              </div>
            </div>
          
          </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300 col-span-full text-center">No items found.</p>
        )}
      </div>
    </div>
  );
}

export default ItemsPage;