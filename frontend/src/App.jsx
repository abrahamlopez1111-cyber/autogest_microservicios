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

// 🧱 LAYOUT GLOBAL (🔥 clave para todo el proyecto)
function Layout({ children }) {
  return (
    <div style={styles.layout}>
      {children}
    </div>
  );
}

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
    <Layout>
      {/* 🔥 NAVBAR */}
      <nav style={styles.nav}>
        <h3 style={{ margin: 0 }}>AUTOGEST</h3>

        <div>
          {usuario && (
            <>
              <span style={{ marginRight: "10px" }}>
                {usuario.nombre}
              </span>

              <button onClick={handleLogout} style={styles.logoutBtn}>
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </nav>

      {/* 📦 CONTENIDO */}
      <main style={styles.main}>
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
                <h2 style={{ color: "white" }}>Panel Recepción</h2>
              </ProtectedRoute>
            }
          />

          {/* 👑 ADMIN */}
          {/* 🔥 IMPORTANTE: dejamos solo /admin */}
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
      </main>
    </Layout>
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

// 🎨 ESTILOS GLOBALES
const styles = {
  layout: {
    minHeight: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    background: "#0f172a",
  },

  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 25px",
    background: "#1e3a8a",
    color: "white",
    width: "100%",
  },

  main: {
    flex: 1,
    width: "100%",
    padding: "20px",
    boxSizing: "border-box",
  },

  logoutBtn: {
    padding: "6px 12px",
    background: "#ef4444",
    border: "none",
    color: "white",
    cursor: "pointer",
    borderRadius: "6px",
  },
};