import { useEffect, useState } from "react";
import {
  getCitas,
  crearCita,
  eliminarCita,
} from "../services/citasApi";

function Citas() {
  const [citas, setCitas] = useState([]);
  const [nueva, setNueva] = useState({
    cliente_id: "",
    vehiculo_id: "",
    mecanico_id: "",
    fecha: "",
    hora: "",
    descripcion: "",
  });

  const obtenerCitas = async () => {
    try {
      const data = await getCitas();
      setCitas(data);
    } catch (error) {
      console.error("Error al obtener citas:", error);
    }
  };

  useEffect(() => {
    obtenerCitas();
  }, []);

  const handleCrear = async () => {
    try {
      await crearCita(nueva);

      // limpiar formulario
      setNueva({
        cliente_id: "",
        vehiculo_id: "",
        mecanico_id: "",
        fecha: "",
        hora: "",
        descripcion: "",
      });

      obtenerCitas();
    } catch (error) {
      console.error("Error al crear cita:", error);
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarCita(id);
      obtenerCitas();
    } catch (error) {
      console.error("Error al eliminar cita:", error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📅 Gestión de Citas</h1>

      {/* FORMULARIO */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input
          value={nueva.cliente_id}
          placeholder="Cliente"
          onChange={(e) =>
            setNueva({ ...nueva, cliente_id: e.target.value })
          }
        />

        <input
          value={nueva.vehiculo_id}
          placeholder="Vehículo"
          onChange={(e) =>
            setNueva({ ...nueva, vehiculo_id: e.target.value })
          }
        />

        <input
          value={nueva.mecanico_id}
          placeholder="Mecánico"
          onChange={(e) =>
            setNueva({ ...nueva, mecanico_id: e.target.value })
          }
        />

        <input
          type="date"
          value={nueva.fecha}
          onChange={(e) =>
            setNueva({ ...nueva, fecha: e.target.value })
          }
        />

        <input
          type="time"
          value={nueva.hora}
          onChange={(e) =>
            setNueva({ ...nueva, hora: e.target.value })
          }
        />

        <input
          value={nueva.descripcion}
          placeholder="Descripción"
          onChange={(e) =>
            setNueva({ ...nueva, descripcion: e.target.value })
          }
        />

        <button onClick={handleCrear}>Crear</button>
      </div>

      {/* TABLA */}
      <h2 style={{ marginTop: "20px" }}>Lista de Citas</h2>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Vehículo</th>
            <th>Mecánico</th>
            <th>Fecha</th>
            <th>Hora</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>
          {citas.length === 0 ? (
            <tr>
              <td colSpan="7">No hay citas</td>
            </tr>
          ) : (
            citas.map((c) => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.cliente_id}</td>
                <td>{c.vehiculo_id}</td>
                <td>{c.mecanico_id}</td>
                <td>{c.fecha}</td>
                <td>{c.hora}</td>
                <td>
                  <button onClick={() => handleEliminar(c.id)}>🗑️</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Citas;