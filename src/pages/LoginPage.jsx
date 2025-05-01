import React, { useState } from 'react';
import { loginUser, registerUser } from '../api';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');

    try {
      if (isRegister) {
        // IMPORTANT: Sending password via query params is insecure.
        // Please change your backend to accept these in the request body.
        const response = await registerUser({ name, email, password });
        if (response.data.success) {
          setMessage(response.data.message + ". You can now log in.");
          setMessageType('success');
          // Optionally switch to login form after successful registration
          setIsRegister(false);
          setName(''); // Clear form fields
          setEmail('');
          setPassword('');
        } else {
          setMessage(response.data.message);
          setMessageType('error');
        }
      } else {
        // IMPORTANT: Sending password via query params is insecure.
        // Please change your backend to accept these in the request body.
        const response = await loginUser({ email, password });
        if (response.data.success) {
          localStorage.setItem('token', response.data.payload.token);
          localStorage.setItem('user', JSON.stringify(response.data.payload.user)); // Store user object
          navigate('/items'); // Redirect to items page on success
        } else {
          setMessage(response.data.message);
          setMessageType('error');
        }
      }
    } catch (error) {
        const errorMessage = error.response?.data?.message || 'An error occurred. Please try again.';
        console.error("API Error:", error.response || error);
        setMessage(errorMessage);
        setMessageType('error');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl"> {/* Menggunakan class Tailwind */}
      <h2 className="text-2xl font-bold mb-6 text-center">{isRegister ? 'Register' : 'Login'}</h2>
      <form onSubmit={handleSubmit}>
        {isRegister && (
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
        )}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-300"
          >
            {isRegister ? 'Register' : 'Login'}
          </button>
        </div>
      </form>
      {message && (
        <p className={`mt-4 text-center text-sm ${messageType === 'success' ? 'text-green-500' : 'text-red-500'}`}>
          {message}
        </p>
      )}
      <p className="mt-6 text-center text-gray-600 text-sm">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}
        <button
          onClick={() => setIsRegister(!isRegister)}
          className="ml-1 text-blue-500 hover:text-blue-800 font-semibold focus:outline-none"
        >
           {isRegister ? 'Login here' : 'Register here'}
        </button>
      </p>
    </div>
  );
}

export default LoginPage;