import React, { createContext, useContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('swiftship_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [token, setToken] = useState(() => localStorage.getItem('swiftship_token') || null);
  const [loading, setLoading] = useState(true);
  const [socket, setSocket] = useState(null);
  const { addToast } = useToast();

  useEffect(() => {
    const isLocalhost = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' ||
      window.location.hostname === '127.0.0.1'
    );
    const socketUrl = import.meta.env.VITE_SOCKET_URL || (isLocalhost ? 'http://localhost:5000' : null);

    if (!socketUrl) {
      console.log('[Socket.IO] No remote WebSocket URL configured for production (VITE_SOCKET_URL). Live push notifications fallback active.');
      setSocket({
        on: () => {},
        off: () => {},
        emit: () => {},
        disconnect: () => {},
      });
      return;
    }

    const initSocket = io(socketUrl, {
      autoConnect: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 3000,
      timeout: 5000,
    });

    setSocket(initSocket);

    initSocket.on('connect', () => {
      console.log('[Socket.IO Client] Connected to server.');
    });

    initSocket.on('connect_error', () => {
      console.warn('[Socket.IO] Connecting to server at ' + socketUrl + '...');
    });

    initSocket.on('parcel_status_change', (data) => {
      addToast(`Real-time update: Shipment ${data.trackingNumber} status changed to ${data.status.replace(/_/g, ' ')}!`, 'info');
    });

    return () => {
      initSocket.disconnect();
    };
  }, [addToast]);

  useEffect(() => {
    const verifyUser = async () => {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success) {
            setUser(res.data.user);
            localStorage.setItem('swiftship_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.error('Auth verification failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    verifyUser();
  }, [token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('swiftship_token', newToken);
        localStorage.setItem('swiftship_user', JSON.stringify(userData));
        addToast(`Welcome back, ${userData.name}!`, 'success');
        return { success: true, user: userData };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please verify credentials.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const register = async (formData) => {
    try {
      const res = await api.post('/auth/register', formData);
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        setToken(newToken);
        setUser(userData);
        localStorage.setItem('swiftship_token', newToken);
        localStorage.setItem('swiftship_user', JSON.stringify(userData));
        addToast(`Account registered successfully! Welcome ${userData.name}.`, 'success');
        return { success: true, user: userData };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('swiftship_token');
    localStorage.removeItem('swiftship_user');
    addToast('Logged out successfully.', 'info');
  };

  const updateProfile = async (formData) => {
    try {
      const res = await api.put('/auth/profile', formData);
      if (res.data.success) {
        setUser(res.data.user);
        localStorage.setItem('swiftship_user', JSON.stringify(res.data.user));
        addToast('Profile updated successfully!', 'success');
        return { success: true, user: res.data.user };
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile.';
      addToast(msg, 'error');
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        socket,
        isAuthenticated: !!user && !!token,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
