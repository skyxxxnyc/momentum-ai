import React from 'react';
import { Navigate } from 'react-router-dom';
import { useUserStore } from '@/stores/user-store';
interface ProtectedRouteProps {
  children: React.ReactElement;
}
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useUserStore(s => s.isAuthenticated);
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
}