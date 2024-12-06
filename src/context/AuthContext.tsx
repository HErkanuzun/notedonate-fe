import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import axios, { AxiosInstance } from 'axios';
import { User } from '../types';
import { toast } from 'react-toastify';

// Create axios instance with proper configuration
const api: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8000',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest'
  },
  withCredentials: true
});

// Add request interceptor
api.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
    }
    return Promise.reject(error);
  }
);

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem('auth_token');
      if (token) {
        try {
          const response = await api.get('/api/v1/auth/user');
          if (response.data?.user) {
            setUser(response.data.user);
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem('auth_token');
            setIsLoggedIn(false);
            setUser(null);
          }
        } catch (error) {
          console.error('Token verification failed:', error);
          localStorage.removeItem('auth_token');
          setIsLoggedIn(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Get CSRF cookie
      await api.get('/sanctum/csrf-cookie');
      
      // Login request
      const response = await api.post('/api/v1/auth/login', { email, password });
      
      if (response.data?.token && response.data?.user) {
        localStorage.setItem('auth_token', response.data.token);
        setUser(response.data.user);
        setIsLoggedIn(true);
        toast.success('Login successful!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      localStorage.removeItem('auth_token');
      setIsLoggedIn(false);
      setUser(null);
      
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Login failed. Please try again.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Get CSRF cookie
      await api.get('/sanctum/csrf-cookie');
      
      // Register request
      const response = await api.post('/api/v1/auth/register', {
        email,
        password,
        password_confirmation: password,
        name
      });
      
      if (response.data?.token && response.data?.user) {
        localStorage.setItem('auth_token', response.data.token);
        setUser(response.data.user);
        setIsLoggedIn(true);
        toast.success('Registration successful!');
      } else {
        toast.success(response.data?.message || 'Registration successful! Please check your email.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Registration failed. Please try again.');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/v1/auth/logout');
      localStorage.removeItem('auth_token');
      setIsLoggedIn(false);
      setUser(null);
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
      localStorage.removeItem('auth_token');
      setIsLoggedIn(false);
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}