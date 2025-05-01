import React, { useState } from 'react';
import { loginUser, registerUser } from '../api';
import { useNavigate, Navigate } from 'react-router-dom';
import loginImage from '../assets/shop.jpg';

function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    try {
      if (isRegister) {
        const response = await registerUser({ name, email, password });
        if (response.data.success) {
          setMessage(response.data.message + ". Anda bisa login sekarang.");
          setMessageType('success');
          setIsRegister(false);
          setName('');
          setEmail('');
          setPassword('');
        } else {
          setMessage(response.data.message);
          setMessageType('error');
        }
      } else {
        const response = await loginUser({ email, password });
        if (response.data.success) {
          localStorage.setItem('token', response.data.payload.token);
          localStorage.setItem('user', JSON.stringify(response.data.payload.user));
          navigate('/items');
        } else {
          setMessage(response.data.message);
          setMessageType('error');
        }
      }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'Terjadi kesalahan. Silakan coba lagi.';
        console.error("API Error:", error.response || error);
        setMessage(errorMessage);
        setMessageType('error');
    }
  };

  const isLoggedIn = !!localStorage.getItem('token');
  if (isLoggedIn) {
    return <Navigate to="/items" />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-sm md:max-w-3xl w-full rounded-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl dark:shadow-lg transition-colors duration-300 text-gray-900 dark:text-white flex flex-col md:flex-row p-0 overflow-hidden min-h-[34rem]">

        <div className="w-full md:w-1/2 bg-gray-200 dark:bg-gray-700 flex-shrink-0 overflow-hidden">
          <img src={loginImage} alt="Login Illustration" className="w-full h-full object-cover" />
        </div>

         <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-10 flex-grow">
              <h2 className="text-2xl font-bold mb-6 text-center w-full">
                  {isRegister ? 'Daftar Akun Baru' : 'Masuk ke Akun Anda'}
              </h2>
              <form onSubmit={handleSubmit} className="w-full">
                  {isRegister && (
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Nama:</label>
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                      />
                    </div>
                  )}
                  <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Email:</label>
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="password" className="block text-sm font-bold mb-2 text-gray-700 dark:text-gray-300">Password:</label>
                    <input
                      type="password"
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow-outline text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      type="submit"
                      className="rounded-full bg-gradient-to-br from-blue-800 via-blue-500 to-blue-700 hover:from-blue-900 hover:via-blue-700 hover:to-blue-900 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300 w-full dark:bg-blue-700 dark:hover:bg-blue-800"
                    >
                      {isRegister ? 'Daftar' : 'Masuk'}
                    </button>
                  </div>
              </form>
              {message && (
                <p className={`mt-4 text-center text-sm ${messageType === 'success' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {message}
                </p>
              )}
              <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
                  {isRegister ? 'Sudah punya akun?' : "Belum punya akun?"}
                  <button
                      onClick={() => setIsRegister(!isRegister)}
                      className="ml-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-600 font-semibold focus:outline-none"
                  >
                      {isRegister ? 'Masuk di sini' : 'Daftar di sini'}
                  </button>
              </p>
         </div>
      </div>
    </div>
  );
}

export default LoginPage;