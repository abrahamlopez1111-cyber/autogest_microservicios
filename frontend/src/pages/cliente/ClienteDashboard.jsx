import { useState } from "react";
import MisCitas from "./MisCitas";
import CrearCita from "./CrearCita";
import PerfilUsuario from "../../components/perfil/PerfilUsuario";
import PerfilGuard from "../../components/perfil/PerfilGuard"; // 🔥 NUEVO

function ClienteDashboard() {
  return (
    <PerfilGuard>
      <ClienteContenido />
    </PerfilGuard>
  );
}

// 🔥 COMPONENTE INTERNO (MEJOR PRÁCTICA)
function ClienteContenido() {
  const [vista, setVista] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.panel}>

        {/* 🟢 MENÚ */}
        {!vista && (
          <>
            <h1 style={styles.title}>🚗 Panel Cliente</h1>

            <div style={styles.cards}>

              <div
                style={styles.card}
                onClick={() => setVista("citas")}
              >
                <h3>📋 Mis Citas</h3>
                <p>Consulta tus citas programadas</p>
              </div>

              <div
                style={styles.card}
                onClick={() => setVista("crear")}
              >
                <h3>➕ Crear Cita</h3>
                <p>Agenda un nuevo servicio</p>
              </div>

              {/* 👤 PERFIL */}
              <div
                style={styles.card}
                onClick={() => setVista("perfil")}
              >
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
              {vista === "citas" && <MisCitas />}
              {vista === "crear" && <CrearCita />}
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

const styles = {
  container: {
    padding: "40px",
    display: "flex",
    justifyContent: "center",
  },

  panel: {
    width: "100%",
    maxWidth: "1000px",
    background: "#0f172a",
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
    transition: "0.3s",
  },

  content: {
    marginTop: "30px",
  },

  backBtn: {
    marginTop: "20px",
    padding: "10px",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
};

export default ClienteDashboard;