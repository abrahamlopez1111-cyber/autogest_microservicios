import { useState } from "react";
import UsuariosPanel from "./UsuariosPanel";
import SucursalesPanel from "./SucursalesPanel";
import MecanicosPanel from "./MecanicosPanel";

import PerfilUsuario from "../../components/perfil/PerfilUsuario";
import PerfilGuard from "../../components/perfil/PerfilGuard"; // 🔥 NUEVO

function AdminDashboard() {
  return (
    <PerfilGuard>
      <AdminContenido />
    </PerfilGuard>
  );
}

// 🔥 SEPARAMOS LA LÓGICA (MEJOR PRÁCTICA)
function AdminContenido() {
  const [vista, setVista] = useState("menu");

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚙️ Panel Administrador</h1>

      {/* 🟢 MENU */}
      {vista === "menu" && (
        <div style={styles.grid}>

          <div
            style={styles.card}
            onClick={() => setVista("usuarios")}
          >
            <h2>👤 Usuarios</h2>
            <p>Gestión de usuarios del sistema</p>
          </div>

          <div
            style={styles.card}
            onClick={() => setVista("sucursales")}
          >
            <h2>🏢 Sucursales</h2>
            <p>Administrar sedes y capacidades</p>
          </div>

          <div
            style={styles.card}
            onClick={() => setVista("mecanicos")}
          >
            <h2>🔧 Mecánicos</h2>
            <p>Asignación de personal técnico</p>
          </div>

          {/* 👤 PERFIL */}
          <div
            style={styles.card}
            onClick={() => setVista("perfil")}
          >
            <h2>👤 Mi Perfil</h2>
            <p>Gestionar información personal</p>
          </div>

        </div>
      )}

      {/* 🔵 VISTAS */}
      {vista !== "menu" && (
        <>
          <button
            style={styles.backBtn}
            onClick={() => setVista("menu")}
          >
            ⬅ Volver
          </button>

          <div style={styles.content}>
            {vista === "usuarios" && <UsuariosPanel volver={() => setVista("menu")} />}
            {vista === "sucursales" && <SucursalesPanel volver={() => setVista("menu")} />}
            {vista === "mecanicos" && <MecanicosPanel volver={() => setVista("menu")} />}
            {vista === "perfil" && <PerfilUsuario volver={() => setVista("menu")} />}
          </div>
        </>
      )}

    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "40px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
  },

  card: {
    background: "#1f2937",
    padding: "30px",
    borderRadius: "12px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.3s ease",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },

  content: {
    marginTop: "20px",
  },

  backBtn: {
    marginBottom: "20px",
    padding: "10px",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
};

export default AdminDashboard;