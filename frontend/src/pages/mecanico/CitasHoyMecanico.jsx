import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CitasHoyMecanico() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [perfiles, setPerfiles] = useState({}); // 🔥 NUEVO

  const navigate = useNavigate();

  useEffect(() => {
    const cargarCitasHoy = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
        if (!usuario) return;

        setLoading(true);

        // 🔥 1. obtener mecánico
        const resMecanicos = await fetch("http://localhost:8000/mecanicos");
        const mecanicos = await resMecanicos.json();

        const mecanico = mecanicos.find(
          (m) => m.usuario_id === usuario.id_usuarios
        );

        if (!mecanico) {
          setCitas([]);
          return;
        }

        // 🔥 2. citas del día
        const resCitas = await fetch(
          `http://localhost:8000/citas/mecanico/${mecanico.id}/hoy`
        );
        const citasData = await resCitas.json();

        // 🔥 3. traer datos base
        const [resUsuarios, resVehiculos] = await Promise.all([
          fetch("http://localhost:8002/usuarios"),
          fetch("http://localhost:8003/historial/vehiculos"),
        ]);

        const usuariosData = await resUsuarios.json();
        const vehiculosData = await resVehiculos.json();

        setUsuarios(usuariosData);
        setVehiculos(vehiculosData);
        setCitas(citasData);

        // 🔥 4. TRAER PERFILES (AQUÍ ESTÁ LA CLAVE)
        const perfilesTemp = {};

        await Promise.all(
          citasData.map(async (c) => {
            try {
              const resPerfil = await fetch(
                `http://localhost:8002/perfil/${c.usuario_id}`
              );

              if (resPerfil.ok) {
                const perfil = await resPerfil.json();
                perfilesTemp[c.usuario_id] = perfil;
              }
            } catch (error) {
              console.log("Error perfil:", error);
            }
          })
        );

        setPerfiles(perfilesTemp);

      } catch (error) {
        console.error("❌ Error:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarCitasHoy();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📅 Citas de Hoy</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : citas.length === 0 ? (
        <p>No hay citas hoy</p>
      ) : (
        citas.map((c) => {
          const cliente = usuarios.find(
            (u) => u.id_usuarios === c.usuario_id
          );

          const perfil = perfiles[c.usuario_id]; // 🔥 AQUÍ

          const vehiculo = vehiculos.find(
            (v) => v.id === c.vehiculo_id
          );

          return (
            <button
              key={c.id}
              style={styles.card}
              onClick={() => navigate(`/detalle-cita/${c.id}`)}
            >
              <p><strong>👤 Nombre:</strong> {cliente?.nombre || "N/A"}</p>

              <p>
                <strong>📱 Teléfono:</strong>{" "}
                {perfil?.telefono || "N/A"}
              </p>

              <p><strong>🚗 Placa:</strong> {vehiculo?.placa || "N/A"}</p>

              <p>
                <strong>⏰ Hora:</strong>{" "}
                {new Date(c.fecha_hora_inicio).toLocaleTimeString("es-CO", {
                  timeZone: "America/Bogota",
                })}
              </p>
            </button>
          );
        })
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  card: {
    background: "#1e293b",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
    border: "none",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
  },
};

export default CitasHoyMecanico;