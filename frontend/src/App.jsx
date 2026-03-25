import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Usuarios from "./pages/usuarios";
import Citas from "./pages/citas";

// 🔥 PROTECCIÓN
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

// 🔥 ROLES
import { getRol } from "./utils/auth";

function App() {
  const rol = getRol();

  return (
    <Router>
      <div style={{ padding: "20px" }}>
        
        {/* 🔥 NAVBAR DINÁMICO */}
        <nav>
          <Link to="/">Inicio</Link> |{" "}
          <Link to="/login">Login</Link> |{" "}

          {/* 🔒 SOLO SI ESTÁ LOGUEADO */}
          {rol && (
            <>
              <Link to="/citas">Citas</Link> |{" "}
            </>
          )}

          {/* 🔐 SOLO ADMIN */}
          {rol === "admin" && (
            <>
              <Link to="/usuarios">Usuarios</Link> |{" "}
              <Link to="/admin">Panel Admin</Link> |{" "}
            </>
          )}
        </nav>

        <Routes>
          {/* 🔓 PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* 🔒 PROTEGIDA (CUALQUIER USUARIO LOGUEADO) */}
          <Route
            path="/citas"
            element={
              <ProtectedRoute>
                <Citas />
              </ProtectedRoute>
            }
          />

          {/* 🔐 SOLO ADMIN */}
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <Usuarios />
                </RoleRoute>
              </ProtectedRoute>
            }
          />

          {/* 👑 PANEL ADMIN */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={["admin"]}>
                  <Admin />
                </RoleRoute>
              </ProtectedRoute>
            }
          />
        </Routes>

      </div>
    </Router>
  );
}

export default App;