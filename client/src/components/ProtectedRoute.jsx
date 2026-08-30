import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated } from "../services/api";

function ProtectedRoute({ children }) {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export default ProtectedRoute;