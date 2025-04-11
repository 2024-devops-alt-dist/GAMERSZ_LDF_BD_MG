import { useState, useEffect, ReactNode } from 'react';
import { AuthContext, User } from '../context/auth-context';

interface AuthProviderProps {
  children: ReactNode;
}
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  const login = (user: User) => {
    setUser(user);
    setIsAuthenticated(true);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/auth/me', {
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Not authenticated');
        const data = await response.json();
        setUser(data.user);
        setIsAuthenticated(true);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const logout = () => {
    fetch('http://localhost:3000/api/auth/logout', {
      method: 'POST',
      credentials: 'include',
    });
    setUser(null);
    setIsAuthenticated(false);
  };
  if (loading) return <div>Loading...</div>;
  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
