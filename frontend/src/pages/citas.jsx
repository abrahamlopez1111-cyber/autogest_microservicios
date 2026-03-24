import { useEffect, useState } from "react";
<<<<<<< HEAD
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
    const data = await getCitas();
    setCitas(data);
  };

  useEffect(() => {
    obtenerCitas();
  }, []);

  const handleCrear = async () => {
    await crearCita(nueva);
    obtenerCitas();
  };

  const handleEliminar = async (id) => {
    await eliminarCita(id);
    obtenerCitas();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📅 Gestión de Citas</h1>

      {/* FORMULARIO */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        <input placeholder="Cliente"
          onChange={(e) => setNueva({ ...nueva, cliente_id: e.target.value })}
        />
        <input placeholder="Vehículo"
          onChange={(e) => setNueva({ ...nueva, vehiculo_id: e.target.value })}
        />
        <input placeholder="Mecánico"
          onChange={(e) => setNueva({ ...nueva, mecanico_id: e.target.value })}
        />
        <input type="date"
          onChange={(e) => setNueva({ ...nueva, fecha: e.target.value })}
        />
        <input type="time"
          onChange={(e) => setNueva({ ...nueva, hora: e.target.value })}
        />
        <input placeholder="Descripción"
          onChange={(e) => setNueva({ ...nueva, descripcion: e.target.value })}
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
          {citas.map((c) => (
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
          ))}
        </tbody>
      </table>
=======
import { getClientes } from "../services/citasApi";

function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getClientes()
      .then(data => {
        setClientes(data);
        setCargando(false);
      })
      .catch(err => {
        console.error(err);
        setError("No se pudo cargar la lista de clientes");
        setCargando(false);
      });
  }, []);

  if (cargando) return <p>Cargando clientes...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Clientes</h2>
      <ul>
        {clientes.map(c => (
          <li key={c.id}>{c.nombre}</li>
        ))}
      </ul>
>>>>>>> 693fb39 (Microservicios con historial de vehiculos y clientes con 8 endpoints)
    </div>
  );
}

<<<<<<< HEAD
export default Citas;
=======
export default Clientes;
>>>>>>> 693fb39 (Microservicios con historial de vehiculos y clientes con 8 endpoints)
