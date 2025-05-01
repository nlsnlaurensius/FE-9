import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ItemsPage from './pages/ItemsPage';
import MyTransactionsPage from './pages/MyTransactionsPage'; // Bonus page

// Simple component to check if user is logged in and protect routes
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  // Basic logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // Remove user info too
    // Redirecting is handled by PrivateRoute on subsequent renders or manual navigation
    window.location.href = '/'; // Force a refresh to clear state and redirect
  };

  // Simple check for logged-in state for conditional rendering of nav links
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-gray-100"> {/* Menggunakan class Tailwind untuk layout dasar */}
        <nav className="bg-white shadow-md py-4 px-6 flex justify-between items-center"> {/* Styling Navbar */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-semibold">Home (Login/Register)</Link>
            {isLoggedIn && <Link to="/items" className="text-gray-700 hover:text-blue-600 font-semibold">Items</Link>}
            {isLoggedIn && <Link to="/transactions" className="text-gray-700 hover:text-blue-600 font-semibold">My Transactions</Link>}
          </div>
          <div className="flex items-center">
            {isLoggedIn && (
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
              >
                Logout
              </button>
            )}
          </div>
        </nav>

        <div className="flex-grow container mx-auto mt-8 p-6 bg-white shadow-md rounded-lg"> {/* Styling Konten Utama */}
          <Routes>
            <Route path="/" element={<LoginPage />} />
            {/* Protected routes */}
            <Route path="/items" element={<PrivateRoute><ItemsPage /></PrivateRoute>} />
             <Route path="/transactions" element={<PrivateRoute><MyTransactionsPage /></PrivateRoute>} /> {/* Bonus Route */}
            {/* Fallback for unknown routes */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;