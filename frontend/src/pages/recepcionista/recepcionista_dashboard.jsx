import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function RecepcionistaDashboard() {

  const navigate = useNavigate();
  const [notificaciones, setNotificaciones] = useState(0);


  // =========================
  // 🔥 CARGAR NOTIFICACIONES
  // =========================
  useEffect(() => {

    const cargarNotificaciones = async () => {

      try {

        const usuario = JSON.parse(
          localStorage.getItem("usuario")
        );

        if (!usuario) return;


        // obtener recepcionista
        const resRecep = await fetch(
          "http://localhost:8000/recepcionistas"
        );

        const recepcionistas = await resRecep.json();

        const recepcionista = recepcionistas.find(
          (r) => r.usuario_id === usuario.id_usuarios
        );

        if (!recepcionista) return;


        // citas de la sucursal
        const resCitas = await fetch(
          `http://localhost:8000/citas/sucursal/${recepcionista.sucursal_id}`
        );

        const citas = await resCitas.json();


        // solo finalizadas
        const pendientesFacturar = citas.filter(
          (c) => c.estado === "finalizada"
        );


        setNotificaciones(
          pendientesFacturar.length
        );

      } catch (error) {

        console.error(
          "Error notificaciones:",
          error
        );

      }

    };


    cargarNotificaciones();

  }, []);



  return (
    <div style={styles.container}>


      {/* HEADER */}
      <div style={styles.header}>
        <h1>🏢 Panel Recepcionista</h1>
        <p>Gestiona la recepción y facturación</p>
      </div>



      {/* BOTONES */}
      <div style={styles.grid}>


        {/* CITAS */}
        <button
          style={styles.card}
          onClick={() =>
            navigate("/recepcionista/citas-hoy")
          }
        >

          <span style={styles.icon}>
            📅
          </span>

          <h3>Citas de Hoy</h3>

          <p>
            Recibir vehículos
          </p>

        </button>



        {/* FACTURACION */}
        <button
          style={styles.card}
          onClick={() =>
            navigate("/recepcionista/facturacion")
          }
        >

          {notificaciones > 0 && (
            <div style={styles.badge}>
              {notificaciones}
            </div>
          )}

          <span style={styles.icon}>
            💰
          </span>

          <h3>Facturación</h3>

          <p>
            Vehículos terminados
          </p>

        </button>



        {/* VER FACTURAS */}
        <button
          style={styles.card}
          onClick={() =>
            navigate("/recepcionista/facturas")
          }
        >

          <span style={styles.icon}>
            📄
          </span>

          <h3>Facturas</h3>

          <p>
            Ver y descargar facturas
          </p>

        </button>



        {/* VOLVER */}
        <button
          style={styles.card}
          onClick={() =>
            navigate("/")
          }
        >

          <span style={styles.icon}>
            🔙
          </span>

          <h3>Volver</h3>

          <p>
            Menú principal
          </p>

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
    gridTemplateColumns:
      "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    maxWidth: "1000px",
    margin: "auto",
  },


  card: {
    position: "relative",
    background: "#1e293b",
    padding: "30px",
    borderRadius: "15px",
    border: "none",
    cursor: "pointer",
    textAlign: "center",
    fontSize: "18px",
    color: "white",
  },


  icon: {
    fontSize: "32px",
    display: "block",
    marginBottom: "10px",
  },


  badge: {
    position: "absolute",
    top: "10px",
    right: "10px",
    background: "#ef4444",
    width: "28px",
    height: "28px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: "14px",
    color: "white",
  },

};