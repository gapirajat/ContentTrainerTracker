import React, { useState } from 'react';
import { useAuth } from '../../context/authContext';
import DialogBox from './dialogbox';
import { useGeneral } from '../../context/generalContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const {showSnackbar, setSnackbarMessage} = useGeneral();

    const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const navigate = useNavigate()
  const from = location.state?.from?.pathname || "/";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      console.log(import.meta.env.VITE_APP_HOST2)
      await login(username, password);
      await setSnackbarMessage("Logged In")
      await showSnackbar()
      // navigate(from, { replace: true });
    } catch (error) {
      console.log(error)
      alert('Login failed.:' + error.response.data.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="space-y-6 w-80">
        <div className='w-full flex justify-center'>
            <img className='scale-75' src="maxeutech_logo.png" alt="Logo" />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md outline-none"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md outline-none"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-500"
        >
          Login
        </button>
        <p className="text-sm text-center text-gray-600">
          Login Issue?{' '}
          <a href="#" className="font-medium text-indigo-600 hover:underline" onMouseDown={()=>setIsDialogOpen(true)}>
            Contact Admin
          </a>
          
        </p>
      </form>
      <DialogBox isDialogOpen={isDialogOpen} setFunction={setIsDialogOpen} />
    </div>
  );
}

export default Login;
