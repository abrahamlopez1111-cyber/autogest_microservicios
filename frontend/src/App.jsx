import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";

// 📄 Páginas
import Admin from "./pages/admin/AdminDashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Usuarios from "./pages/usuarios";
import Citas from "./pages/citas";

// 🔐 Protección
import ProtectedRoute from "./components/ProtectedRoute";

// 🔑 Auth
import { getUsuario } from "./utils/auth";

import ClienteDashboard from "./pages/cliente/ClienteDashboard";
function AppContent() {
  const usuario = getUsuario();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    navigate("/login");
  };

  return (
    <div>

      {/* 🔥 NAVBAR */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "15px 25px",
          background: "#1e3a8a",
          color: "white",
        }}
      >
        <h3 style={{ margin: 0 }}>AUTOGEST</h3>

        {/* LINKS */}
        <div>
          <Link to="/" style={{ color: "white", marginRight: "15px" }}>
            Inicio
          </Link>

          {!usuario && (
            <Link to="/login" style={{ color: "white", marginRight: "15px" }}>
              Login
            </Link>
          )}

          {usuario && (
            <>
              {/* 👤 CLIENTE */}
              {usuario.rol === "cliente" && (
                <Link to="/citas" style={{ color: "white", marginRight: "15px" }}>
                  Mis Citas
                </Link>
              )}

              {/* 🔧 MECÁNICO */}
              {usuario.rol === "mecanico" && (
                <Link to="/mecanico" style={{ color: "white", marginRight: "15px" }}>
                  Agenda
                </Link>
              )}

              {/* 🧑‍💼 RECEPCIÓN */}
              {usuario.rol === "recepcionista" && (
                <Link to="/recepcion" style={{ color: "white", marginRight: "15px" }}>
                  Gestión
                </Link>
              )}

              {/* 👑 ADMIN */}
              {usuario.rol === "admin" && (
                <>
                  <Link to="/usuarios" style={{ color: "white", marginRight: "15px" }}>
                    Usuarios
                  </Link>
                  <Link to="/admin" style={{ color: "white", marginRight: "15px" }}>
                    Panel
                  </Link>
                </>
              )}
            </>
          )}
        </div>

        {/* USUARIO */}
        <div>
          {usuario && (
            <>
              <span style={{ marginRight: "10px" }}>
                {usuario.nombre}
              </span>

              <button
                onClick={handleLogout}
                style={{
                  padding: "5px 10px",
                  background: "#ef4444",
                  border: "none",
                  color: "white",
                  cursor: "pointer",
                  borderRadius: "5px",
                }}
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 📦 CONTENIDO */}
      <div style={{ padding: "20px" }}>
        <Routes>

          {/* 🌍 PÚBLICAS */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />

          {/* 📅 CLIENTE */}
          <Route
            path="/citas"
            element={
              <ProtectedRoute rolesPermitidos={["cliente"]}>
                <Citas />
              </ProtectedRoute>
            }
          />

          {/* 🔧 MECÁNICO (placeholder) */}
          <Route
            path="/mecanico"
            element={
              <ProtectedRoute rolesPermitidos={["mecanico"]}>
                <h2>Panel Mecánico</h2>
              </ProtectedRoute>
            }
          />

          {/* 🧑‍💼 RECEPCIÓN (placeholder) */}
          <Route
            path="/recepcion"
            element={
              <ProtectedRoute rolesPermitidos={["recepcionista"]}>
                <h2>Panel Recepción</h2>
              </ProtectedRoute>
            }
          />

          {/* 👑 ADMIN */}
          <Route
            path="/usuarios"
            element={
              <ProtectedRoute rolesPermitidos={["admin"]}>
                <Usuarios />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin"
            element={
              <ProtectedRoute rolesPermitidos={["admin"]}>
                <Admin />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cliente"
            element={
              <ProtectedRoute rolesPermitidos={["cliente"]}>
                <ClienteDashboard />
              </ProtectedRoute>
            }
          />

        </Routes>



      </div>

    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;