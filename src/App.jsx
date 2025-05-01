import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ItemsPage from './pages/ItemsPage';
import MyTransactionsPage from './pages/MyTransactionsPage';
import LandingPage from './pages/LandingPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <Router>
       <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300 font-montserrat">

         <Navbar />

  
         <main className="flex-grow container mx-auto mt-4 p-4 md:p-6">
           <Routes>
             <Route path="/" element={<LandingPage />} />
             <Route path="/login" element={<LoginPage />} />
             <Route path="/items" element={<PrivateRoute><ItemsPage /></PrivateRoute>} />
             <Route path="/transactions" element={<PrivateRoute><MyTransactionsPage /></PrivateRoute>} />
             <Route path="*" element={<Navigate to="/" />} /> 
           </Routes>
         </main>

           <footer className="bg-white dark:bg-gray-800 text-center p-4 mt-auto text-gray-700 dark:text-gray-300 text-sm shadow-md dark:shadow-lg transition-colors duration-300"> {/* mt-auto untuk dorong ke bawah */}
               © 2025 KUTEK Online Shop. All rights reserved.
           </footer>

       </div>
    </Router>
  );
}

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

export default App;