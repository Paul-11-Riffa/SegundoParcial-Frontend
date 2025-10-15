import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const token = localStorage.getItem('authToken');

    if (storedUser && token) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
      // Verificamos si el rol es ADMIN
      if (parsedUser.profile && parsedUser.profile.role === 'ADMIN') {
        setIsAdmin(true);
      }
    }
  }, []);

  return { user, isAuthenticated, isAdmin };
};