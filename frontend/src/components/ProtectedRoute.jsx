import { Navigate } from "react-router-dom";
import { getUsuario } from "../utils/auth";

function ProtectedRoute({ children }) {
  const user = getUsuario();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default ProtectedRoute;