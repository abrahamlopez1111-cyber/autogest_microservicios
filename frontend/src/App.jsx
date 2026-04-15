import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";

// 📄 Páginas
import Admin from "./pages/admin/AdminDashboard";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Usuarios from "./pages/usuarios";
import Citas from "./pages/citas";
import ClienteDashboard from "./pages/cliente/ClienteDashboard";
import DashboardMecanico from "./pages/mecanico/DashboardMecanico";
import Register from "./pages/Register";

// 🔥 NUEVAS PÁGINAS
import CitasHoyMecanico from "./pages/mecanico/CitasHoyMecanico";
import DetalleCita from "./pages/mecanico/DetalleCita";

// 🔐 Protección
import ProtectedRoute from "./components/ProtectedRoute";

// 🔑 Auth
import { getUsuario } from "./utils/auth";

function AppContent() {
  const usuario = getUsuario();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("rol");
    localStorage.removeItem("user_id");
    navigate("/login");
  };

  return (
    <div>
      {/* 🔥 NAVBAR LIMPIO */}
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
        {/* SOLO NOMBRE */}
        <h3 style={{ margin: 0 }}>AUTOGEST</h3>

        {/* SOLO USUARIO + LOGOUT */}
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
          <Route path="/register" element={<Register />} />

          {/* 📅 CLIENTE */}
          <Route
            path="/citas"
            element={
              <ProtectedRoute rolesPermitidos={["cliente"]}>
                <Citas />
              </ProtectedRoute>
            }
          />

          {/* 🔧 MECÁNICO */}
          <Route
            path="/mecanico"
            element={
              <ProtectedRoute rolesPermitidos={["mecanico"]}>
                <DashboardMecanico />
              </ProtectedRoute>
            }
          />

          {/* 🔥 NUEVAS RUTAS MECÁNICO */}
          <Route
            path="/citas-hoy"
            element={
              <ProtectedRoute rolesPermitidos={["mecanico"]}>
                <CitasHoyMecanico />
              </ProtectedRoute>
            }
          />

          <Route
            path="/detalle-cita/:id"
            element={
              <ProtectedRoute rolesPermitidos={["mecanico"]}>
                <DetalleCita />
              </ProtectedRoute>
            }
          />

          {/* 🧑‍💼 RECEPCIÓN */}
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

          {/* 👤 CLIENTE DASHBOARD */}
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