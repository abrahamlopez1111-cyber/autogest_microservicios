import { useEffect, useState } from "react";

function DashboardMecanico() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const mecanicoId = localStorage.getItem("user_id");

  useEffect(() => {
    if (!mecanicoId) {
      setError("No se encontró el ID del mecánico");
      setLoading(false);
      return;
    }

    fetch(`http://localhost:8000/citas/mecanico/${mecanicoId}`)
      .then(res => {
        if (!res.ok) throw new Error("Error al obtener citas");
        return res.json();
      })
      .then(data => {
        setCitas(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError("Error cargando citas");
        setLoading(false);
      });

  }, [mecanicoId]);

  const cambiarEstado = (id, nuevoEstado) => {
    fetch(`http://localhost:8002/citas/${id}/estado?estado=${nuevoEstado}`, {
      method: "PUT"
    })
      .then(() => {
        setCitas(prev =>
          prev.map(c =>
            c.id === id ? { ...c, estado: nuevoEstado } : c
          )
        );
      })
      .catch(err => {
        console.error("Error actualizando estado:", err);
      });
  };

  if (loading) return <p>Cargando citas...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>🧑‍🔧 Mis Citas</h2>

      {citas.length === 0 && <p>No tienes citas asignadas</p>}

      {citas.map(cita => {
        const fecha = new Date(cita.fecha_hora_inicio);

        return (
          <div
            key={cita.id}
            style={{
              border: "1px solid #ccc",
              margin: "10px",
              padding: "15px",
              borderRadius: "10px",
              background: "#f9fafb"
            }}
          >
            <p><strong>📅 Fecha:</strong> {fecha.toLocaleDateString()}</p>
            <p><strong>⏰ Hora:</strong> {fecha.toLocaleTimeString()}</p>
            <p><strong>🚗 Vehículo ID:</strong> {cita.vehiculo_id}</p>
            <p><strong>📌 Estado:</strong> {cita.estado}</p>

            <div style={{ marginTop: "10px" }}>
              <button
                onClick={() => cambiarEstado(cita.id, "en_proceso")}
                style={{ marginRight: "10px" }}
              >
                Iniciar
              </button>

              <button
                onClick={() => cambiarEstado(cita.id, "completada")}
              >
                Completar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default DashboardMecanico;