// src/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useGeneral } from './generalContext';
import api from '../api/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const [authToken, setAuthToken] = useState(localStorage.getItem('token'));
  const [user, setUser] = useState({})
  const [Loading, setLoading] = useState(false);

  const {showSnackbar, setSnackbarMessage, setSnackbarOpen} = useGeneral();


  //checks if valid token using server side middleware
  const validateToken = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_APP_HOST2}/users/auth`, {
        headers: { Authorization: `Bearer ${authToken}` },
      }
    );
      console.log("token validated")
      setUser({username:response.data.username, role:response.data.role})
      return response.status === 200;
    } catch (error) {
      console.error('Token validation failed:', error);
      return false;
    }
  };

  useEffect(() => {
    setLoading(true)
    // Check token validity on app load
    const checkAuth = async () => {
      if (authToken && !(await validateToken())) {
        logout();
      } 
      if (await validateToken()) {
        api.defaults.headers['Authorization'] = `Bearer ${authToken}`;
        console.log(api.defaults.headers['Authorization'])
        setSnackbarMessage("Logged In")
        showSnackbar()
        console.log(authToken)
        setAuthToken(authToken);
      }

    };
    checkAuth();
    setLoading(false);
  }, [authToken]);

  //user is username
  const login = async (username, password) => {
    setLoading(true)
    console.log(import.meta.env.VITE_APP_HOST2)
    console.log({ })
    const response = await axios.post(`${import.meta.env.VITE_APP_HOST2}/users/login`, { username, password });
    const username2 = response.data.username;
    const role = response.data.role;
    const token = response.data.token;
    //temporary because coordinator validation is not implemented 
    // if (token.role == 'coordinator') {
    //     //query to check course
    //     setAuthToken(token);
    // } else {
    //     setAuthToken(token);
    // }
    setUser({username:username2, role:role})
    setAuthToken(token);
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    setLoading(false)
  };

  const logout = () => {
    console.log("logged out")
    setAuthToken(null);
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    delete api.defaults.headers.common['Authorization'];
  };



  return (
    <AuthContext.Provider value={{ authToken,user, login, logout, Loading, setLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

//role, *course, username, validity status(no need to check validity as it would automatically remove invalid token)
