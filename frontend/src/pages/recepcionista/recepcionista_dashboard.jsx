import { useNavigate } from "react-router-dom";

function RecepcionistaDashboard() {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h1>🏢 Panel Recepcionista</h1>
        <p>Gestiona la recepción de vehículos</p>
      </div>

      {/* BOTONES */}
      <div style={styles.grid}>

        <button
          style={styles.card}
          onClick={() => navigate("/recepcionista/citas-hoy")}
        >
          <span style={styles.icon}>📅</span>
          <h3>Citas de Hoy</h3>
          <p>Ver y recibir vehículos</p>
        </button>

        <button
          style={styles.card}
          onClick={() => alert("Historial en construcción")}
        >
          <span style={styles.icon}>📋</span>
          <h3>Historial</h3>
          <p>Próximamente</p>
        </button>

        <button
          style={styles.card}
          onClick={() => navigate("/")}
        >
          <span style={styles.icon}>🔙</span>
          <h3>Volver</h3>
          <p>Menú principal</p>
        </button>

      </div>
    </div>
  );
}

export default RecepcionistaDashboard;

const styles = {
  container: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    padding: "40px",
  },

  header: {
    textAlign: "center",
    marginBottom: "40px",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    maxWidth: "900px",
    margin: "auto",
  },

  card: {
    background: "#1e293b",
    padding: "30px",
    borderRadius: "15px",
    border: "none",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "18px",
    transition: "0.3s",
  },

  icon: {
    fontSize: "30px",
    display: "block",
    marginBottom: "10px",
  },
};