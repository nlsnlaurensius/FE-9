import React, { useState, useEffect } from 'react';
import { getAllItems, createTransaction, payTransaction } from '../api';
import { useNavigate } from 'react-router-dom';

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
        navigate('/');
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
        navigate('/');
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
    }
  };


  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Available Items</h2>
      {message && <p className={`mb-4 ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>{message}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> {/* Grid layout dengan Tailwind */}
        {items.length > 0 ? (
          items.map(item => (
            <div key={item.id} className="bg-white p-4 rounded-lg shadow-md flex flex-col items-center text-center"> {/* Item Card Styling */}
              {item.image_url ? (
                <img src={item.image_url} alt={item.name} className="w-full h-32 object-cover rounded-md mb-3" />
              ) : (
                 <div className="w-full h-32 bg-gray-200 flex justify-center items-center rounded-md mb-3 text-gray-500">No Image</div>
              )}
              <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
              <p className="text-gray-600 text-sm mb-2">Price: ${item.price}</p>
              <p className={`text-sm ${item.stock > 0 ? 'text-gray-600' : 'text-red-500'} mb-4`}>Stock: {item.stock}</p>
              <button
                onClick={() => handleBuyItem(item)}
                disabled={item.stock <= 0}
                className="mt-auto bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {item.stock > 0 ? 'Buy' : 'Out of Stock'}
              </button>
            </div>
          ))
        ) : (
          <p>No items found.</p>
        )}
      </div>
    </div>
  );
}

export default ItemsPage;