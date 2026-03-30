import { useState } from "react";
import MisCitas from "./MisCitas";
import CrearCita from "./CrearCita";

function ClienteDashboard() {
  const [vista, setVista] = useState("citas");

  return (
    <div style={styles.container}>
      <div style={styles.panel}>

        {/* 🔥 TÍTULO */}
        <h1 style={styles.title}>
          🚗 Panel Cliente
        </h1>

        {/* 🔘 TARJETAS */}
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

        </div>

        {/* 🔄 CONTENIDO */}
        <div style={styles.content}>
          {vista === "citas" && <MisCitas />}
          {vista === "crear" && <CrearCita />}
        </div>

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
};

export default ClienteDashboard;