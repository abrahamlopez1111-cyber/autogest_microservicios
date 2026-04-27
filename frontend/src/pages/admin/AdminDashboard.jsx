import { useState } from "react";
import UsuariosPanel from "./UsuariosPanel";
import SucursalesPanel from "./SucursalesPanel";
import MecanicosPanel from "./MecanicosPanel";
import RepuestosPanel from "./RepuestosPanel";
import VehiculosPanel from "./VehiculosPanel";
import RecepcionistasPanel from "./RecepcionistasPanel";

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
      <p style={styles.subtitle}>
        Gestiona todos los módulos del sistema AutoGest
      </p>

      {/* 🟢 MENU */}
      {vista === "menu" && (
        <div style={styles.grid}>
          <Card
            icon="👤"
            title="Usuarios"
            desc="Gestión de usuarios del sistema"
            onClick={() => setVista("usuarios")}
          />

          <Card
            icon="🏢"
            title="Sucursales"
            desc="Administrar sedes y capacidades"
            onClick={() => setVista("sucursales")}
          />

          <Card
            icon="🔧"
            title="Mecánicos"
            desc="Asignación de personal técnico"
            onClick={() => setVista("mecanicos")}
          />

          <Card
            icon="🧑‍💼"
            title="Recepcionistas"
            desc="Asignar recepcionistas a sucursales"
            onClick={() => setVista("recepcionistas")}
          />

          <Card
            icon="🚗"
            title="Vehículos"
            desc="Administrar vehículos registrados"
            onClick={() => setVista("vehiculos")}
          />

          <Card
            icon="🧰"
            title="Repuestos"
            desc="Gestión de inventario"
            onClick={() => setVista("repuestos")}
          />

          <Card
            icon="👤"
            title="Mi Perfil"
            desc="Actualizar información personal"
            onClick={() => setVista("perfil")}
          />
        </div>
      )}

      {/* 🔵 VISTAS */}
      {vista !== "menu" && (
        <>
          <button
            style={styles.backBtn}
            onClick={() => setVista("menu")}
          >
            ⬅ Volver al menú
          </button>

          <div style={styles.content}>
            {vista === "usuarios" && (
              <UsuariosPanel volver={() => setVista("menu")} />
            )}

            {vista === "sucursales" && (
              <SucursalesPanel volver={() => setVista("menu")} />
            )}

            {vista === "mecanicos" && (
              <MecanicosPanel volver={() => setVista("menu")} />
            )}

            {vista === "recepcionistas" && (
              <RecepcionistasPanel volver={() => setVista("menu")} />
            )}

            {vista === "perfil" && (
              <PerfilUsuario volver={() => setVista("menu")} />
            )}

            {vista === "repuestos" && (
              <RepuestosPanel volver={() => setVista("menu")} />
            )}

            {vista === "vehiculos" && (
              <VehiculosPanel volver={() => setVista("menu")} />
            )}
          </div>
        </>
      )}
    </div>
  );
}

// 🔥 COMPONENTE CARD (REUTILIZABLE)
function Card({ icon, title, desc, onClick }) {
  return (
    <div style={styles.card} onClick={onClick}>
      <div style={styles.icon}>{icon}</div>
      <h2 style={styles.cardTitle}>{title}</h2>
      <p style={styles.cardDesc}>{desc}</p>
    </div>
  );
}

// 🎨 ESTILOS
const styles = {
  container: {
    padding: "40px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    color: "white",
  },

  title: {
    textAlign: "center",
    fontSize: "32px",
    marginBottom: "10px",
  },

  subtitle: {
    textAlign: "center",
    marginBottom: "40px",
    color: "#94a3b8",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "25px",
  },

  card: {
    background: "#1f2937",
    padding: "25px",
    borderRadius: "15px",
    cursor: "pointer",
    textAlign: "center",
    transition: "all 0.25s ease",
    boxShadow: "0 6px 20px rgba(0,0,0,0.4)",
  },

  icon: {
    fontSize: "40px",
    marginBottom: "10px",
  },

  cardTitle: {
    marginBottom: "8px",
  },

  cardDesc: {
    fontSize: "14px",
    color: "#9ca3af",
  },

  content: {
    marginTop: "20px",
  },

  backBtn: {
    marginBottom: "20px",
    padding: "10px 18px",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default AdminDashboard;