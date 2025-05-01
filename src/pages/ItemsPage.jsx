import React, { useState, useEffect } from 'react';
import { getAllItems, createTransaction, payTransaction } from '../api';
import { useNavigate, Navigate } from 'react-router-dom';

function ItemsPage() {
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
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
          setFilteredItems(response.data.payload);
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

  useEffect(() => {
    const filtered = items.filter(item =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.price.toString().includes(searchTerm)
    );
    setFilteredItems(filtered);
  }, [searchTerm, items]);

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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };


  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Available Items</h2>
      {message && (
        <p className={`mb-4 ${messageType === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
          {message}
        </p>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Cari barang di sini..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {filteredItems.length > 0 ? (
          filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-lg shadow-md flex flex-col dark:bg-gray-700 dark:shadow-lg transition-colors duration-300 overflow-hidden border border-gray-200 dark:border-gray-600">

              <div className="w-full aspect-square overflow-hidden flex items-center justify-center bg-gray-100 dark:bg-gray-600">
                {item.image_url ? (
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-contain" />
                ) : (
                  <div className="w-full h-full flex justify-center items-center text-gray-500 dark:text-gray-400 text-sm p-2 text-center">Tidak Ada Gambar</div>
                )}
              </div>

              <div className="w-full p-3 flex flex-col text-left flex-1">
                <h3 className="text-sm font-semibold text-gray-800 dark:text-white mb-1 line-clamp-2" title={item.name}>{item.name}</h3>

                <p className="text-base font-bold text-gray-900 dark:text-white mb-1">{formatPrice(item.price)}</p>

                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span className={`text-xs ${item.stock > 0 ? 'text-gray-600 dark:text-gray-300' : 'text-red-600 dark:text-red-400'}`}>
                        Stok: {item.stock}
                    </span>
                </div>


                <button
                  onClick={() => handleBuyItem(item)}
                  className={`mt-auto px-3 py-1.5 text-sm font-medium text-white rounded-md transition-colors duration-200
                             ${item.stock > 0
                                ? 'rounded-full bg-gradient-to-br from-blue-800 via-blue-500 to-blue-700 hover:from-blue-900 hover:via-blue-700 hover:to-blue-900 focus:ring-4 focus:ring-blue-300 '
                                : 'bg-gray-400 cursor-not-allowed'
                             }`}
                  disabled={item.stock <= 0}
                >
                  Beli
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600 dark:text-gray-300 col-span-full text-center">
            {searchTerm ? `Tidak ada item ditemukan untuk "${searchTerm}"` : 'No items found.'}
          </p>
        )}
      </div>
    </div>
  );
}

export default ItemsPage;