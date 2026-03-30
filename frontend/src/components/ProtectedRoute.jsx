import { Navigate } from "react-router-dom";
import { getUsuario } from "../utils/auth";

function ProtectedRoute({ children, rolesPermitidos }) {
  const user = getUsuario();

  // 🔒 Si no hay usuario → login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // 🔥 Validar rol (si se especifica)
  if (rolesPermitidos && !rolesPermitidos.includes(user.rol)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;