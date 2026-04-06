import { useEffect, useState } from "react";

function VerCitasMecanico() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const mecanicoId = usuario?.id || usuario?.id_usuarios;

  useEffect(() => {
    if (!mecanicoId) return;

    const cargarCitas = async () => {
      try {
        setLoading(true);

        // 🔥 traer citas del mecánico
        const resCitas = await fetch(
          `http://localhost:8000/citas/mecanico/${mecanicoId}`
        );
        const citasData = await resCitas.json();

        // 🔥 traer datos extra
        const [resSuc, resUsuarios] = await Promise.all([
          fetch("http://localhost:8000/sucursales"),
          fetch("http://localhost:8002/usuarios"),
        ]);

        const sucursales = await resSuc.json();
        const usuarios = await resUsuarios.json();

        // 🔥 enriquecer citas
        const citasFinal = citasData.map((c) => {
          const sucursal = sucursales.find(
            (s) => s.id === c.sucursal_id
          );

          const cliente = usuarios.find(
            (u) => u.id_usuarios === c.usuario_id
          );

          return {
            ...c,
            sucursal_nombre: sucursal?.nombre || "N/A",
            cliente_nombre: cliente?.nombre || "Cliente",
          };
        });

        setCitas(citasFinal);

      } catch (error) {
        console.error("❌ Error cargando citas:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarCitas();
  }, [mecanicoId]);

  // 📅 formato bonito
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Citas Asignadas</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : citas.length === 0 ? (
        <p>No tienes citas asignadas</p>
      ) : (
        citas.map((c) => (
          <div key={c.id} style={styles.card}>
            <p><strong>Cliente:</strong> {c.cliente_nombre}</p>
            <p><strong>Sucursal:</strong> {c.sucursal_nombre}</p>
            <p><strong>Estado:</strong> {c.estado}</p>
            <p><strong>Inicio:</strong> {formatearFecha(c.fecha_hora_inicio)}</p>
          </div>
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
  },
};

export default VerCitasMecanico;