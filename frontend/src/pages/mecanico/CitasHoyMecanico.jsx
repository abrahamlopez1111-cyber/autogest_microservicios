
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GATEWAY = "https://autogest-gateway.onrender.com";

function CitasHoyMecanico() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [perfiles, setPerfiles] = useState({});

  const navigate = useNavigate();

  useEffect(() => {
    cargarCitas();
  }, []);

  const esHoy = (fecha) => {
    const hoy = new Date().toDateString();
    return new Date(fecha).toDateString() === hoy;
  };

  const cargarCitas = async () => {
    try {
      setLoading(true);

      // =========================
      // 🔥 USUARIO LOGUEADO
      // =========================
      const usuario = JSON.parse(
        localStorage.getItem("usuario") || "null"
      );

      console.log("👤 Usuario:", usuario);

      if (!usuario) return;

      // =========================
      // 🔥 OBTENER MECÁNICOS
      // =========================
      const resMecanicos = await fetch(
        `${GATEWAY}/mecanicos`
      );

      const mecanicos = await resMecanicos.json();

      console.log("🔧 Mecánicos:", mecanicos);

      const mecanico = mecanicos.find(
        (m) =>
          Number(m.usuario_id) ===
          Number(usuario.id_usuarios)
      );

      console.log("✅ Mecánico encontrado:", mecanico);

      if (!mecanico) {
        setCitas([]);
        return;
      }

      // =========================
      // 🔥 TRAER TODAS LAS CITAS
      // =========================
      const resCitas = await fetch(
        `${GATEWAY}/citas/mecanico/${mecanico.id}`
      );

      const citasData = await resCitas.json();

      console.log("📅 Todas las citas:", citasData);

      // =========================
      // 🔥 FILTRAR SOLO HOY
      // =========================
      const citasHoy = (Array.isArray(citasData)
        ? citasData
        : []
      ).filter((c) => {
        return (
          esHoy(c.fecha_hora_inicio) &&
          (
            c.estado === "programada" ||
            c.estado === "recibida" ||
            c.estado === "en_proceso"
          )
        );
      });

      console.log("🔥 Citas filtradas:", citasHoy);

      // =========================
      // 🔥 DATOS EXTRA
      // =========================
      const [resUsuarios, resVehiculos] =
        await Promise.all([
          fetch(`${GATEWAY}/usuarios`),
          fetch(`${GATEWAY}/historial/vehiculos`),
        ]);

      const usuariosData = await resUsuarios.json();
      const vehiculosData = await resVehiculos.json();

      setUsuarios(usuariosData);
      setVehiculos(vehiculosData);

      setCitas(citasHoy);

      // =========================
      // 🔥 CARGAR PERFILES
      // =========================
      const perfilesTemp = {};

      await Promise.all(
        citasHoy.map(async (c) => {
          try {
            const resPerfil = await fetch(
              `${GATEWAY}/perfil/${c.usuario_id}`
            );

            if (resPerfil.ok) {
              perfilesTemp[c.usuario_id] =
                await resPerfil.json();
            }
          } catch (error) {
            console.log("❌ Error perfil:", error);
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

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        📅 Citas de Hoy
      </h2>

      {loading ? (
        <p style={styles.empty}>
          Cargando...
        </p>
      ) : citas.length === 0 ? (
        <p style={styles.empty}>
          No hay citas hoy
        </p>
      ) : (
        citas.map((c) => {
          const cliente = usuarios.find(
            (u) =>
              Number(u.id_usuarios) ===
              Number(c.usuario_id)
          );

          const vehiculo = vehiculos.find(
            (v) =>
              Number(v.id) ===
              Number(c.vehiculo_id)
          );

          const perfil = perfiles[c.usuario_id];

          return (
            <button
              key={c.id}
              style={styles.card}
              onClick={() =>
                navigate(`/detalle-cita/${c.id}`)
              }
            >
              <p>
                <strong>👤 Cliente:</strong>{" "}
                {cliente?.nombre || "N/A"}
              </p>

              <p>
                <strong>📱 Teléfono:</strong>{" "}
                {perfil?.telefono || "N/A"}
              </p>

              <p>
                <strong>🚗 Vehículo:</strong>{" "}
                {vehiculo
                  ? `${vehiculo.marca} ${vehiculo.modelo}`
                  : "N/A"}
              </p>

              <p>
                <strong>🔢 Placa:</strong>{" "}
                {vehiculo?.placa || "N/A"}
              </p>

              <p>
                <strong>📌 Estado:</strong>{" "}
                {c.estado}
              </p>

              <p>
                <strong>⏰ Hora:</strong>{" "}
                {new Date(
                  c.fecha_hora_inicio
                ).toLocaleTimeString("es-CO", {
                  timeZone: "America/Bogota",
                  hour: "2-digit",
                  minute: "2-digit",
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
    maxWidth: "650px",
    margin: "auto",
    color: "white",
    padding: "10px",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "26px",
  },

  empty: {
    textAlign: "center",
    color: "#cbd5e1",
  },

  card: {
    background: "#1e293b",
    padding: "16px",
    marginBottom: "12px",
    borderRadius: "12px",
    border: "1px solid #334155",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
    color: "white",
  },
};

export default CitasHoyMecanico;
