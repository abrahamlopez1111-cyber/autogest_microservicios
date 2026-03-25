import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

// 📄 Páginas
import Admin from "./pages/Admin";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Usuarios from "./pages/usuarios";
import Citas from "./pages/citas";

// 🔒 Protección
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";

// 🔑 Auth
import { getRol, getUsuario } from "./utils/auth";

function App() {
  const rol = getRol();
  const usuario = getUsuario();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/login";
  };

  return (
    <Router>
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
          {/* Logo */}
          <h3 style={{ margin: 0 }}>AUTOGEST</h3>

          {/* Links */}
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
                {/* Cliente */}
                {rol === "cliente" && (
                  <Link to="/citas" style={{ color: "white", marginRight: "15px" }}>
                    Mis Citas
                  </Link>
                )}

                {/* Admin */}
                {rol === "admin" && (
                  <>
                    <Link to="/usuarios" style={{ color: "white", marginRight: "15px" }}>
                      Usuarios
                    </Link>
                    <Link to="/admin" style={{ color: "white", marginRight: "15px" }}>
                      Panel Admin
                    </Link>
                  </>
                )}
              </>
            )}
          </div>

          {/* Usuario */}
          <div>
            {usuario && (
              <>
                <span style={{ marginRight: "10px" }}>
                  👋 {usuario.nombre}
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

        {/* 📌 CONTENIDO */}
        <div style={{ padding: "20px" }}>
          <Routes>
            {/* 🔓 Públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* 🔒 Protegidas */}
            <Route
              path="/citas"
              element={
                <ProtectedRoute>
                  <Citas />
                </ProtectedRoute>
              }
            />

            {/* 🔐 Solo Admin */}
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

      </div>
    </Router>
  );
}

export default App;