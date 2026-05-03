import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
} from "react-router-dom";


// =========================
// PÁGINAS GENERALES
// =========================
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Citas from "./pages/citas";


// =========================
// ADMIN
// =========================
import Admin from "./pages/admin/AdminDashboard";
import UsuariosPanel from "./pages/admin/UsuariosPanel";
import SucursalesPanel from "./pages/admin/SucursalesPanel";
import MecanicosPanel from "./pages/admin/MecanicosPanel";
import RecepcionistasPanel from "./pages/admin/RecepcionistasPanel";
import VehiculosPanel from "./pages/admin/VehiculosPanel";
import RepuestosPanel from "./pages/admin/RepuestosPanel";


// =========================
// CLIENTE
// =========================
import ClienteDashboard from "./pages/cliente/ClienteDashboard";


// =========================
// MECÁNICO
// =========================
import DashboardMecanico from "./pages/mecanico/DashboardMecanico";
import CitasHoyMecanico from "./pages/mecanico/CitasHoyMecanico";
import DetalleCita from "./pages/mecanico/DetalleCita";


// =========================
// RECEPCIONISTA
// =========================
import RecepcionistaDashboard from "./pages/recepcionista/recepcionista_dashboard";
import CitasHoyRecepcionista from "./pages/recepcionista/CitasHoyRecepcionista";
import FacturacionRecepcionista from "./pages/recepcionista/FacturacionRecepcionista";
import MisFacturas from "./pages/recepcionista/MisFacturas";

// =========================
// PERFIL
// =========================
import PerfilUsuario from "./components/perfil/PerfilUsuario";
import PerfilGuard from "./components/perfil/PerfilGuard";


// =========================
// AUTH
// =========================
import ProtectedRoute from "./components/ProtectedRoute";
import { getUsuario } from "./utils/auth";



// =========================
// LAYOUT
// =========================
function Layout({ children }) {
  return (
    <div style={styles.layout}>
      {children}
    </div>
  );
}



// =========================
// APP CONTENT
// =========================
function AppContent() {

  const usuario = getUsuario();

  const navigate = useNavigate();


  const handleLogout = () => {

    localStorage.clear();

    navigate("/login");

  };


  return (
    <Layout>

      {/* NAVBAR */}
      <nav style={styles.nav}>

        <h3>AUTOGEST</h3>

        {usuario && (

          <div>

            <span style={{ marginRight: "10px" }}>
              {usuario.nombre}
            </span>

            <button
              onClick={handleLogout}
              style={styles.logoutBtn}
            >
              Cerrar sesión
            </button>

          </div>

        )}

      </nav>



      {/* CONTENIDO */}
      <main style={styles.main}>

        <Routes>


          {/* ========================= */}
          {/* PÚBLICAS */}
          {/* ========================= */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />



          {/* ========================= */}
          {/* ADMIN */}
          {/* ========================= */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute rolesPermitidos={["admin"]}>
                <PerfilGuard>
                  <Admin />
                </PerfilGuard>
              </ProtectedRoute>
            }
          />

          <Route path="/admin/usuarios" element={<UsuariosPanel />} />

          <Route path="/admin/sucursales" element={<SucursalesPanel />} />

          <Route path="/admin/mecanicos" element={<MecanicosPanel />} />

          <Route path="/admin/recepcionistas" element={<RecepcionistasPanel />} />

          <Route path="/admin/vehiculos" element={<VehiculosPanel />} />

          <Route path="/admin/repuestos" element={<RepuestosPanel />} />

          <Route path="/admin/perfil" element={<PerfilUsuario />} />



          {/* ========================= */}
          {/* CLIENTE */}
          {/* ========================= */}
          <Route
            path="/cliente"
            element={
              <ProtectedRoute rolesPermitidos={["cliente"]}>
                <PerfilGuard>
                  <ClienteDashboard />
                </PerfilGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/citas"
            element={
              <ProtectedRoute rolesPermitidos={["cliente"]}>
                <PerfilGuard>
                  <Citas />
                </PerfilGuard>
              </ProtectedRoute>
            }
          />



          {/* ========================= */}
          {/* MECÁNICO */}
          {/* ========================= */}
          <Route
            path="/mecanico"
            element={
              <ProtectedRoute rolesPermitidos={["mecanico"]}>
                <PerfilGuard>
                  <DashboardMecanico />
                </PerfilGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/citas-hoy"
            element={
              <ProtectedRoute rolesPermitidos={["mecanico"]}>
                <PerfilGuard>
                  <CitasHoyMecanico />
                </PerfilGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/detalle-cita/:id"
            element={
              <ProtectedRoute rolesPermitidos={["mecanico"]}>
                <PerfilGuard>
                  <DetalleCita />
                </PerfilGuard>
              </ProtectedRoute>
            }
          />



          {/* ========================= */}
          {/* RECEPCIONISTA */}
          {/* ========================= */}
          <Route
            path="/recepcionista"
            element={
              <ProtectedRoute rolesPermitidos={["recepcionista"]}>
                <PerfilGuard>
                  <RecepcionistaDashboard />
                </PerfilGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/recepcionista/citas-hoy"
            element={
              <ProtectedRoute rolesPermitidos={["recepcionista"]}>
                <PerfilGuard>
                  <CitasHoyRecepcionista />
                </PerfilGuard>
              </ProtectedRoute>
            }
          />

          <Route
            path="/recepcionista/facturacion"
            element={
              <ProtectedRoute rolesPermitidos={["recepcionista"]}>
                <PerfilGuard>
                  <FacturacionRecepcionista />
                </PerfilGuard>
              </ProtectedRoute>
            }
          />



          <Route
            path="/recepcionista/facturas"
            element={
              <ProtectedRoute rolesPermitidos={["recepcionista"]}>
                <PerfilGuard>
                  <MisFacturas />
                </PerfilGuard>
              </ProtectedRoute>
            }
          />


        </Routes>

      </main>

    </Layout>
  );
}



// =========================
// APP
// =========================
function App() {

  return (
    <Router>
      <AppContent />
    </Router>
  );

}

export default App;



// =========================
// ESTILOS
// =========================
const styles = {

  layout: {
    minHeight: "100vh",
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
  },

  main: {
    flex: 1,
    padding: "20px",
  },

  logoutBtn: {
    padding: "8px 14px",
    background: "#ef4444",
    border: "none",
    color: "white",
    borderRadius: "8px",
    cursor: "pointer",
  },

};