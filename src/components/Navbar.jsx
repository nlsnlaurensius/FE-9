import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import moonIcon from '../assets/moon.png';
import sunIcon from '../assets/sun.png';
import logo from '../assets/logoKUTEK.png';

function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const isLoggedIn = !!localStorage.getItem('token');

  const themeIcon = theme === 'light' ? moonIcon : sunIcon;
  const themeAltText = theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md dark:shadow-lg py-4 px-6 flex flex-wrap justify-between items-center transition-colors duration-300 sticky top-0 z-20">

      <div className="flex items-center text-2xl font-black text-gray-800 dark:text-white mr-4 order-1 flex-shrink-0">
        <img src={logo} alt="Logo" className="h-10 w-10 mr-2" />
        <Link to="/">KUTEK</Link>
      </div>

      {isLoggedIn && (
        <div className="hidden md:flex md:items-center md:flex-grow md:justify-center md:order-2 px-4">
           <div className="flex space-x-4">
             <Link to="/items" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-semibold transition-colors duration-300 py-2 px-2">Items</Link>
             <Link to="/transactions" className="text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-semibold transition-colors duration-300 py-2 px-2">My Transactions</Link>
           </div>
        </div>
      )}

      <div className="flex items-center space-x-4 order-2 ml-auto md:ml-0 flex-shrink-0 md:order-3">

        <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            aria-controls="mobile-menu"
            aria-expanded={isOpen}
        >
            <span className="sr-only">Open main menu</span>
            {isOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            )}
        </button>

        {isLoggedIn ? (
          <button
            onClick={handleLogout}
            className="hidden md:block rounded-full bg-gradient-to-br from-red-800 via-red-500 to-red-700 hover:from-red-900 hover:via-red-700 hover:to-red-900 text-white font-semibold py-2 px-4 rounded transition duration-300"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="hidden md:block rounded-full bg-gradient-to-br from-blue-800 via-blue-500 to-blue-700 hover:from-blue-900 hover:via-blue-700 hover:to-blue-900 text-white font-semibold py-2 px-4 rounded transition duration-300">
            Login/Register
          </Link>
        )}

        <button
             onClick={toggleTheme}
             className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300 flex items-center justify-center"
             aria-label="Toggle theme"
          >
            <img
                src={themeIcon}
                alt={themeAltText}
                className="h-5 w-5"
            />
        </button>

      </div>

      <div
          id="mobile-menu"
          className={`${isOpen ? 'block' : 'hidden'} md:hidden w-full flex flex-col space-y-2 mt-4 text-center order-3`}
      >
          {isLoggedIn ? (
              <>
                  <Link onClick={() => setIsOpen(false)} to="/items" className="block py-2 px-4 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-semibold transition-colors duration-300">Items</Link>
                  <Link onClick={() => setIsOpen(false)} to="/transactions" className="block py-2 px-4 text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 font-semibold transition-colors duration-300">My Transactions</Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="block py-2 px-4 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-500 font-semibold transition-colors duration-300 w-full text-center"
                  >
                    Logout
                  </button>
              </>
          ) : (
              <Link onClick={() => setIsOpen(false)} to="/login" className="block py-2 px-4 bg-secondary hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white font-semibold rounded transition duration-300 w-full text-center">
                  Login/Register
              </Link>
          )}
      </div>
    </nav>
  );
}

export default Navbar;