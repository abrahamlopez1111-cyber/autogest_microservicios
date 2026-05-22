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
    const cargarCitasHoy = async () => {
      try {
        setLoading(true);

        // =========================
        // 🔥 USUARIO LOGUEADO
        // =========================
        const usuario = JSON.parse(
          localStorage.getItem("usuario") || "null"
        );

        console.log("👤 Usuario logueado:", usuario);

        if (!usuario) {
          setLoading(false);
          return;
        }

        // =========================
        // 🔥 OBTENER MECÁNICOS
        // =========================
        const resMecanicos = await fetch(
          `${GATEWAY}/mecanicos`
        );

        const mecanicos = await resMecanicos.json();

        console.log("🔧 Mecánicos:", mecanicos);

        // 🔥 BUSCAR MECÁNICO DEL USUARIO
        let mecanico = mecanicos.find(
          (m) =>
            Number(m.usuario_id) ===
            Number(usuario.id_usuarios)
        );

        // 🔥 FALLBACK TEMPORAL
        // Si no encuentra el mecánico por usuario,
        // usa el primero para evitar pantalla vacía
        if (!mecanico && mecanicos.length > 0) {
          console.warn(
            "⚠️ No se encontró mecánico relacionado al usuario. Usando fallback."
          );

          mecanico = mecanicos[0];
        }

        console.log("✅ Mecánico encontrado:", mecanico);

        if (!mecanico) {
          setCitas([]);
          return;
        }

        // =========================
        // 🔥 OBTENER CITAS DEL DÍA
        // =========================
        const resCitas = await fetch(
          `${GATEWAY}/citas/mecanico/${mecanico.id}/hoy`
        );

        const citasData = await resCitas.json();

        console.log("📅 Citas hoy:", citasData);

        // =========================
        // 🔥 TRAER USUARIOS Y VEHÍCULOS
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

        // 🔥 FILTRAR SOLO RECIBIDAS Y PROGRAMADAS
        const citasFiltradas = citasData.filter(
          (c) =>
            c.estado === "programada" ||
            c.estado === "recibida"
        );

        setCitas(citasFiltradas);

        // =========================
        // 🔥 CARGAR PERFILES
        // =========================
        const perfilesTemp = {};

        await Promise.all(
          citasFiltradas.map(async (c) => {
            try {
              const resPerfil = await fetch(
                `${GATEWAY}/perfil/${c.usuario_id}`
              );

              if (resPerfil.ok) {
                const perfil = await resPerfil.json();

                perfilesTemp[c.usuario_id] = perfil;
              }
            } catch (error) {
              console.log(
                "❌ Error cargando perfil:",
                error
              );
            }
          })
        );

        setPerfiles(perfilesTemp);

      } catch (error) {
        console.error("❌ Error general:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarCitasHoy();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        📅 Citas de Hoy
      </h2>

      {loading ? (
        <p style={styles.empty}>
          Cargando citas...
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

          const perfil = perfiles[c.usuario_id];

          const vehiculo = vehiculos.find(
            (v) =>
              Number(v.id) ===
              Number(c.vehiculo_id)
          );

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
    transition: "0.2s",
  },
};

export default CitasHoyMecanico;