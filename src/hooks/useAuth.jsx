import { useState, useEffect } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // <-- NUEVO ESTADO DE CARGA

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user');
      const token = localStorage.getItem('authToken');

      if (storedUser && token) {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
        if (parsedUser.profile && parsedUser.profile.role === 'ADMIN') {
          setIsAdmin(true);
        }
      }
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    } finally {
      setIsLoading(false); // <-- DEJA DE CARGAR AL FINALIZAR
    }
  }, []);

  // Devolvemos el nuevo estado
  return { user, isAuthenticated, isAdmin, isLoading };
};