import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import Admin from "./pages/admin/AdminDashboard";
import ClienteDashboard from "./pages/cliente/ClienteDashboard";
import DashboardMecanico from "./pages/mecanico/DashboardMecanico";
import RecepcionistaDashboard from "./pages/recepcionista/recepcionista_dashboard";

import PerfilGuard from "./components/perfil/PerfilGuard";
import ProtectedRoute from "./components/ProtectedRoute";

import { getUsuario } from "./utils/auth";


// =========================
// LAYOUT PRIVADO
// =========================
function PrivateLayout({
  children,
}) {

  const usuario =
    getUsuario();

  const navigate =
    useNavigate();

  const handleLogout =
    () => {

    localStorage.removeItem(
      "usuario"
    );

    localStorage.removeItem(
      "rol"
    );

    localStorage.removeItem(
      "user_id"
    );

    navigate(
      "/login"
    );
  };

  return (

    <div
      style={
        styles.layout
      }
    >

      <nav
        style={
          styles.nav
        }
      >

        <h3>
          AUTOGEST
        </h3>

        {usuario && (

          <div>

            <span
              style={{
                marginRight:
                  "10px",
              }}
            >
              {
                usuario.nombre
              }
            </span>

            <button
              onClick={
                handleLogout
              }
              style={
                styles.logoutBtn
              }
            >
              Cerrar sesión
            </button>

          </div>

        )}

      </nav>

      <main
        style={
          styles.main
        }
      >
        {children}
      </main>

    </div>
  );
}



// =========================
// APP CONTENT
// =========================
function AppContent() {

  return (

    <Routes>

      {/* PÚBLICAS */}
      <Route
        path="/"
        element={
          <Home />
        }
      />

      <Route
        path="/login"
        element={
          <Login />
        }
      />

      <Route
        path="/register"
        element={
          <Register />
        }
      />


      {/* PERFIL INTERMEDIO */}
      <Route
        path="/perfil"
        element={

          <ProtectedRoute>

            <PrivateLayout>

              <PerfilGuard>

                <div />

              </PerfilGuard>

            </PrivateLayout>

          </ProtectedRoute>

        }
      />


      {/* ADMIN */}
      <Route
        path="/admin"
        element={

          <ProtectedRoute
            rolesPermitidos={[
              "admin",
            ]}
          >

            <PrivateLayout>

              <PerfilGuard>

                <Admin />

              </PerfilGuard>

            </PrivateLayout>

          </ProtectedRoute>

        }
      />


      {/* CLIENTE */}
      <Route
        path="/cliente"
        element={

          <ProtectedRoute
            rolesPermitidos={[
              "cliente",
            ]}
          >

            <PrivateLayout>

              <PerfilGuard>

                <ClienteDashboard />

              </PerfilGuard>

            </PrivateLayout>

          </ProtectedRoute>

        }
      />


      {/* MECÁNICO */}
      <Route
        path="/mecanico"
        element={

          <ProtectedRoute
            rolesPermitidos={[
              "mecanico",
            ]}
          >

            <PrivateLayout>

              <PerfilGuard>

                <DashboardMecanico />

              </PerfilGuard>

            </PrivateLayout>

          </ProtectedRoute>

        }
      />


      {/* RECEPCIONISTA */}
      <Route
        path="/recepcionista"
        element={

          <ProtectedRoute
            rolesPermitidos={[
              "recepcionista",
            ]}
          >

            <PrivateLayout>

              <PerfilGuard>

                <RecepcionistaDashboard />

              </PerfilGuard>

            </PrivateLayout>

          </ProtectedRoute>

        }
      />


      {/* FALLBACK */}
      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
        }
      />

    </Routes>
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



const styles = {

  layout: {
    minHeight:
      "100vh",
    display:
      "flex",
    flexDirection:
      "column",
    background:
      "#0f172a",
  },

  nav: {
    display:
      "flex",
    justifyContent:
      "space-between",
    alignItems:
      "center",
    padding:
      "15px 25px",
    background:
      "#1e3a8a",
    color:
      "white",
  },

  main: {
    flex: 1,
    padding:
      "20px",
  },

  logoutBtn: {
    padding:
      "8px 14px",
    background:
      "#ef4444",
    border:
      "none",
    color:
      "white",
    borderRadius:
      "8px",
    cursor:
      "pointer",
  },

};