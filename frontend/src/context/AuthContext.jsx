import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile on mount if token exists
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success) {
            const userData = res.data.data?.user || res.data.user;
            if (userData) {
              setUser(userData);
              localStorage.setItem('user', JSON.stringify(userData));
            }
          }
        } catch (err) {
          console.error('Auth verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };
    initAuth();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        const payload = res.data.data || res.data;
        const { token: jwtToken, user: userData } = payload;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success(`Welcome back, ${userData?.name || 'Student'}!`);
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Please check credentials.');
      return false;
    }
  };

  const register = async (formData) => {
    try {
      const res = await API.post('/auth/register', formData);
      if (res.data.success) {
        const payload = res.data.data || res.data;
        const { token: jwtToken, user: userData } = payload;
        setToken(jwtToken);
        setUser(userData);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Registration successful! Welcome to Knowvia.');
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed.');
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully.');
  };

  const updateProfile = async (updateData) => {
    try {
      const res = await API.put('/users/profile', updateData);
      if (res.data.success) {
        const userData = res.data.data?.user || res.data.user;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Profile updated!');
        return true;
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Profile update failed.');
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        logout,
        updateProfile,
        isAuthenticated: !!user && !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
