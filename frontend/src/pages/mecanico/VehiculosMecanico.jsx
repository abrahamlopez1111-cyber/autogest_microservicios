import { useEffect, useState } from "react";

const GATEWAY = "https://autogest-gateway.onrender.com";

function VehiculosMecanico() {
  const [vehiculos, setVehiculos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  useEffect(() => {
    cargarVehiculos();
  }, []);

  const cargarVehiculos = async () => {
    try {
      setLoading(true);

      // 1. Obtener mecánico vinculado al usuario
      const resMecanicos = await fetch(`${GATEWAY}/mecanicos`);
      const mecanicos = await resMecanicos.json();
      const mecanico = mecanicos.find(
        (m) => m.usuario_id === usuario?.id_usuarios
      );

      if (!mecanico) {
        setError("No se encontró tu perfil de mecánico.");
        return;
      }

      // 2. Obtener citas asignadas al mecánico
      const resCitas = await fetch(`${GATEWAY}/citas/mecanico/${mecanico.id}`);
      const citas = await resCitas.json();

      // 3. Obtener todos los vehículos
      const resVehiculos = await fetch(`${GATEWAY}/historial/vehiculos`);
      const todosVehiculos = await resVehiculos.json();

      // 4. Filtrar vehículos que tienen cita con este mecánico
      const idsVehiculos = [...new Set(citas.map((c) => c.vehiculo_id))];
      const vehiculosFiltrados = todosVehiculos.filter((v) =>
        idsVehiculos.includes(v.id)
      );

      // 5. Enriquecer con estado de cita
      const vehiculosConEstado = vehiculosFiltrados.map((v) => {
        const citaVehiculo = citas
          .filter((c) => c.vehiculo_id === v.id)
          .sort((a, b) => new Date(b.fecha_hora_inicio) - new Date(a.fecha_hora_inicio));
        return {
          ...v,
          ultima_cita_estado: citaVehiculo[0]?.estado || "—",
          ultima_cita_fecha: citaVehiculo[0]?.fecha_hora_inicio || null,
        };
      });

      setVehiculos(vehiculosConEstado);

    } catch (err) {
      console.error(err);
      setError("Error cargando vehículos.");
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "—";
    return new Date(fecha).toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  const colorEstado = (estado) => {
    const colores = {
      pendiente: "#f59e0b",
      en_proceso: "#3b82f6",
      finalizada: "#22c55e",
      cancelada: "#ef4444",
    };
    return colores[estado] || "#94a3b8";
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🚗 Vehículos Asignados</h2>

      {loading && <p style={styles.msg}>Cargando...</p>}
      {error && <p style={{ ...styles.msg, color: "#ef4444" }}>{error}</p>}

      {!loading && !error && vehiculos.length === 0 && (
        <p style={styles.msg}>No tienes vehículos asignados.</p>
      )}

      {vehiculos.map((v) => (
        <div key={v.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.placa}>{v.placa}</span>
            <span style={{ ...styles.badge, background: colorEstado(v.ultima_cita_estado) }}>
              {v.ultima_cita_estado}
            </span>
          </div>
          <p style={styles.info}><strong>Marca:</strong> {v.marca}</p>
          <p style={styles.info}><strong>Modelo:</strong> {v.modelo}</p>
          <p style={styles.info}><strong>Año:</strong> {v.anio_fabricacion}</p>
          <p style={styles.info}><strong>Última cita:</strong> {formatearFecha(v.ultima_cita_fecha)}</p>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { maxWidth: "700px", margin: "auto", color: "white" },
  title: { textAlign: "center", marginBottom: "20px" },
  msg: { textAlign: "center", color: "#94a3b8" },
  card: {
    background: "#1e293b",
    padding: "16px 20px",
    marginBottom: "12px",
    borderRadius: "12px",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "10px",
  },
  placa: { fontWeight: "bold", fontSize: "16px", letterSpacing: "1px" },
  badge: {
    fontSize: "12px",
    padding: "3px 10px",
    borderRadius: "20px",
    color: "white",
    fontWeight: "500",
  },
  info: { margin: "4px 0", fontSize: "14px", color: "#cbd5e1" },
};

export default VehiculosMecanico;