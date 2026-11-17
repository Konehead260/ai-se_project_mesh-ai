import { useAuth } from "../../contexts/AuthContext";
import {
  Outlet,
  Navigate,
  useLocation,
  useOutletContext,
} from "react-router-dom";

export function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  const context = useOutletContext();
  const location = useLocation();
  if (isLoading) return null;
  return isAuthenticated ? (
    <Outlet context={context} />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}

export function PublicRoute() {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return null;
  return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />;
}