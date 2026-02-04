import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import LoadingSpinner from '@/components/ui/loading-spinner';
import { setupAutoLogout } from '@/lib/security';

export default function ProtectedRoute({ 
  children,
  requiredRole
}: { 
  children: React.ReactNode;
  requiredRole?: string;
}) {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    // Setup auto logout listener
    setupAutoLogout(() => {
      navigate('/login');
    });
  }, [navigate]);

  useEffect(() => {
    const checkAuthorization = async () => {
      if (!loading) {
        if (!user) {
          // Redirect to login if not authenticated
          navigate('/login', { 
            state: { from: location.pathname },
            replace: true 
          });
        } else if (requiredRole) {
          // Check role-based access if required
          // For admin role, we check if user has admin role
          if (requiredRole === 'admin' && user.role === 'admin') {
            setIsAuthorized(true);
          } else {
            // For other roles or if not authorized
            navigate('/');
          }
        } else {
          // User is authenticated and no specific role required
          setIsAuthorized(true);
        }
        setAuthLoading(false);
      }
    };

    checkAuthorization();
  }, [user, loading, requiredRole, navigate, location.pathname]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!isAuthorized) {
    return null;
  }

  return <>{children}</>;
}