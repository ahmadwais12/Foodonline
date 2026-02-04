import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthUser } from '@/types';
import { authService } from '@/services/auth.service';
import { userService } from '@/services/user.service';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Check if user is already logged in
    const initializeAuth = async () => {
      try {
        // Check for existing user in session storage first (faster)
        const sessionUser = sessionStorage.getItem('user');
        if (sessionUser) {
          try {
            const userObj = JSON.parse(sessionUser);
            setUser(userObj);
            return;
          } catch (parseError) {
            console.error('Session user parse error:', parseError);
            sessionStorage.removeItem('user');
          }
        }
        
        // Check for existing tokens
        const token = localStorage.getItem('token');
        if (token) {
          // Fetch full user profile
          try {
            const userProfile = await userService.getProfile();
            setUser(userProfile);
          } catch (fetchError) {
            console.error('User profile fetch error:', fetchError);
            // Clear invalid token
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      mounted = false;
    };
  }, []);

  const login = async (authUser: AuthUser) => {
    // Fetch full user profile after login
    try {
      const userProfile = await userService.getProfile();
      setUser(userProfile);
    } catch (error) {
      console.error('Failed to fetch user profile after login:', error);
      // Fall back to the authUser data
      setUser(authUser);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUser(null);
      // Clear session storage
      sessionStorage.removeItem('user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}