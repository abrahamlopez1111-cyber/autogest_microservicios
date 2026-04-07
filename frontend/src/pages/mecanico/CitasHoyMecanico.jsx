import { useEffect, useState } from "react";

function CitasHoyMecanico({ onSeleccionar }) {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargarCitas = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("usuario") || "null");

        if (!user) return;

        const mecanicoId = user.id || user.id_usuarios;
        if (!mecanicoId) return;

        setLoading(true);

        const resCitas = await fetch(
          `http://localhost:8000/citas/mecanico/${mecanicoId}`
        );

        const citasData = await resCitas.json();

        const [resSuc, resUsuarios, resVehiculos] = await Promise.all([
          fetch("http://localhost:8000/sucursales"),
          fetch("http://localhost:8002/usuarios"),
          fetch("http://localhost:8003/vehiculos"), // 🔥 AJUSTA SI NECESARIO
        ]);

        const sucursales = await resSuc.json();
        const usuarios = await resUsuarios.json();
        const vehiculos = await resVehiculos.json();

        const hoy = new Date().toLocaleDateString("en-CA");

        const citasHoy = citasData
          .filter((c) => {
            if (!c.fecha_hora_inicio) return false;

            const fechaLocal = new Date(c.fecha_hora_inicio)
              .toLocaleDateString("en-CA");

            return fechaLocal === hoy;
          })
          .map((c) => {
            const sucursal = sucursales.find(
              (s) => s.id === c.sucursal_id
            );

            const cliente = usuarios.find(
              (u) => u.id_usuarios === c.usuario_id
            );

            const vehiculo = vehiculos.find(
              (v) => v.id === c.vehiculo_id
            );

            return {
              ...c,
              cliente_nombre: cliente?.nombre || "Cliente",
              telefono: cliente?.telefono || "N/A", // 🔥 si luego lo tienes
              placa: vehiculo?.placa || "N/A",
              sucursal_nombre: sucursal?.nombre || "N/A",
            };
          });

        setCitas(citasHoy);

      } catch (error) {
        console.error("❌ Error:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarCitas();
  }, []);

  const formatearHora = (fecha) => {
    return new Date(fecha).toLocaleTimeString("es-CO", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📅 Citas de Hoy</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : citas.length === 0 ? (
        <p>No tienes citas hoy</p>
      ) : (
        citas.map((c) => (
          <button
            key={c.id}
            style={styles.card}
            onClick={() => onSeleccionar(c)} // 🔥 CLAVE
          >
            <p><strong>👤 Cliente:</strong> {c.cliente_nombre}</p>
            <p><strong>📱 Teléfono:</strong> {c.telefono}</p>
            <p><strong>🚗 Placa:</strong> {c.placa}</p>
            <p><strong>⏰ Hora:</strong> {formatearHora(c.fecha_hora_inicio)}</p>
          </button>
        ))
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