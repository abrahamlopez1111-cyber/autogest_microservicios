import { useState } from "react";
import UsuariosPanel from "./UsuariosPanel";
import SucursalesPanel from "./SucursalesPanel";
import MecanicosPanel from "./MecanicosPanel";
import RepuestosPanel from "./RepuestosPanel";
import VehiculosPanel from "./VehiculosPanel";

import PerfilUsuario from "../../components/perfil/PerfilUsuario";
import PerfilGuard from "../../components/perfil/PerfilGuard";

function AdminDashboard() {
  return (
    <PerfilGuard>
      <AdminContenido />
    </PerfilGuard>
  );
}

function AdminContenido() {
  const [vista, setVista] = useState("menu");

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>⚙️ Panel Administrador</h1>

      {vista === "menu" && (
        <div style={styles.grid}>

          <div style={styles.card} onClick={() => setVista("usuarios")}>
            <h2>👤 Usuarios</h2>
            <p>Gestión de usuarios del sistema</p>
          </div>

          <div style={styles.card} onClick={() => setVista("sucursales")}>
            <h2>🏢 Sucursales</h2>
            <p>Administrar sedes y capacidades</p>
          </div>

          <div style={styles.card} onClick={() => setVista("mecanicos")}>
            <h2>🔧 Mecánicos</h2>
            <p>Asignación de personal técnico</p>
          </div>

          <div style={styles.card} onClick={() => setVista("perfil")}>
            <h2>👤 Mi Perfil</h2>
            <p>Gestionar información personal</p>
          </div>

          <div style={styles.card} onClick={() => setVista("repuestos")}>
            <h2>🧰 Repuestos</h2>
            <p>Gestión de repuestos y precios</p>
          </div>

          <div style={styles.card} onClick={() => setVista("vehiculos")}>
            <h2>🚗 Vehículos</h2>
            <p>Ver vehículos y su sucursal</p>
          </div>

        </div>
      )}

      {vista !== "menu" && (
        <>
          <button
            style={styles.backBtn}
            onClick={() => setVista("menu")}
          >
            ⬅ Volver
          </button>

          <div style={styles.content}>
            {vista === "usuarios" && <UsuariosPanel />}
            {vista === "sucursales" && <SucursalesPanel />}
            {vista === "mecanicos" && <MecanicosPanel />}
            {vista === "perfil" && <PerfilUsuario />}
            {vista === "repuestos" && <RepuestosPanel />}
            {vista === "vehiculos" && <VehiculosPanel />}
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
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },

  content: {
    marginTop: "20px",
  },

  backBtn: {
    marginBottom: "20px",
    padding: "10px 15px",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
};

export default AdminDashboard;