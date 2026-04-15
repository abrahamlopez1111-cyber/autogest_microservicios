import { Navigate } from "react-router-dom";
import { getRol } from "../utils/auth";

function RoleRoute({ children, allowedRoles }) {
  const rol = getRol();

  if (!allowedRoles.includes(rol)) {
    return <Navigate to="/" />;
  }

  return children;
}

export default RoleRoute;