import { useEffect, useState } from "react";

import VerCitasMecanico from "./VerCitasMecanico";
import VehiculosMecanico from "./VehiculosMecanico";

function DashboardMecanico() {
  const [vista, setVista] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.panel}>

        {/* 🟢 MENÚ */}
        {!vista && (
          <>
            <h1 style={styles.title}>🔧 Panel Mecánico</h1>

            <div style={styles.cards}>

              <div
                style={styles.card}
                onClick={() => setVista("citas")}
              >
                <h3>📋 Ver Citas</h3>
                <p>Citas asignadas al mecánico</p>
              </div>

              <div
                style={styles.card}
                onClick={() => setVista("vehiculos")}
              >
                <h3>🚗 Vehículos</h3>
                <p>Vehículos asignados</p>
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