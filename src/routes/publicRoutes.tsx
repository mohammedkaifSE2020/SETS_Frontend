import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../context/useAuthStore';

const PublicRoutes: React.FC = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // If already logged in, redirect away from public auth pages to the lobby
  return !isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default PublicRoutes;