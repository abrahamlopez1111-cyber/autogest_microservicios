import { useState } from "react";

import VerCitasMecanico from "./VerCitasMecanico";
import VehiculosMecanico from "./VehiculosMecanico";
import PerfilUsuario from "../../components/perfil/PerfilUsuario";
import PerfilGuard from "../../components/perfil/PerfilGuard";
import CitasHoyMecanico from "./CitasHoyMecanico"; // 🔥 AHORA ES COMPONENTE SEPARADO

// ============================
// 🚀 COMPONENTE PRINCIPAL
// ============================
function DashboardMecanico() {
  return (
    <PerfilGuard>
      <MecanicoContenido />
    </PerfilGuard>
  );
}

// ============================
// 🔧 CONTENIDO
// ============================
function MecanicoContenido() {
  const [vista, setVista] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.panel}>

        {/* 🟢 MENÚ */}
        {!vista && (
          <>
            <h1 style={styles.title}>🔧 Panel Mecánico</h1>

            <div style={styles.cards}>
              <div style={styles.card} onClick={() => setVista("citas")}>
                <h3>📋 Ver Citas</h3>
                <p>Citas asignadas</p>
              </div>

              <div style={styles.card} onClick={() => setVista("vehiculos")}>
                <h3>🚗 Vehículos</h3>
                <p>Vehículos asignados</p>
              </div>

              <div style={styles.card} onClick={() => setVista("hoy")}>
                <h3>📅 Citas de Hoy</h3>
                <p>Servicios del día</p>
              </div>

              <div style={styles.card} onClick={() => setVista("perfil")}>
                <h3>👤 Mi Perfil</h3>
                <p>Gestionar información personal</p>
              </div>
            </div>
          </>
        )}

        {/* 🔵 CONTENIDO */}
        {vista && (
          <>
            <button
              style={styles.backBtn}
              onClick={() => setVista(null)}
            >
              ⬅ Volver
            </button>

            <div style={styles.content}>
              {vista === "citas" && <VerCitasMecanico />}
              {vista === "vehiculos" && <VehiculosMecanico />}
              {vista === "hoy" && <CitasHoyMecanico />}
              {vista === "perfil" && (
                <PerfilUsuario volver={() => setVista(null)} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================
// 🎨 ESTILOS
// ============================
const styles = {
  container: {
    padding: "40px",
    display: "flex",
    justifyContent: "center",
  },

  panel: {
    width: "100%",
    maxWidth: "1000px",
    background: "#020617",
    borderRadius: "15px",
    padding: "30px",
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
  },

  cards: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    width: "250px",
    textAlign: "center",
    cursor: "pointer",
  },

  content: {
    marginTop: "30px",
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

export default DashboardMecanico;