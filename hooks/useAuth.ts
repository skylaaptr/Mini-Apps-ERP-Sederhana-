
import { useState, useEffect, useCallback } from 'react';
import { User } from '../types';

const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('erp-user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = useCallback((username: string) => {
    if (username.trim()) {
      const newUser: User = { username };
      localStorage.setItem('erp-user', JSON.stringify(newUser));
      setUser(newUser);
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('erp-user');
    setUser(null);
  }, []);

  return { user, login, logout, loading };
};

export default useAuth;
