import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../context/useAuthStore';

const ProtectedRoutes = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If not authenticated, redirect to registration
  if (!isAuthenticated) {
    return <Navigate to="/register" replace />;
  }

  // If authenticated, render child routes
  return <Outlet />;
};

export default ProtectedRoutes;