import { useState } from "react";
import UsuariosPanel from "../components/UsuariosPanel";
import SucursalesPanel from "../components/SucursalesPanel";
import MecanicosPanel from "../components/MecanicosPanel";

function Admin() {
  const [vista, setVista] = useState("menu");

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚙️ Panel Administrador</h1>

      {/* MENU */}
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
        </div>
      )}

      {/* VISTAS */}
      {vista === "usuarios" && (
        <UsuariosPanel volver={() => setVista("menu")} />
      )}

      {vista === "sucursales" && (
        <SucursalesPanel volver={() => setVista("menu")} />
      )}

      {vista === "mecanicos" && (
        <MecanicosPanel volver={() => setVista("menu")} />
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
};

// 🔥 Hover manual (React inline hack)
styles.card[":hover"] = {
  transform: "scale(1.05)",
};

export default Admin;