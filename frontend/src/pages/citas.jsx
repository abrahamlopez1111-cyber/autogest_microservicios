import { useEffect, useState } from "react";
import {
  getCitas,
  crearCita,
  getSucursales,
  getMecanicos,
} from "../services/citasApi";

function Citas() {
  const [citas, setCitas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [mecanicos, setMecanicos] = useState([]);

  const [nueva, setNueva] = useState({
    sucursal_id: "",
    mecanico_id: "",
    vehiculo_id: "",
    fecha: "",
    hora: "",
  });

  const [error, setError] = useState("");

  // 🔥 CARGAR DATOS
  useEffect(() => {
    cargarTodo();
  }, []);

  const cargarTodo = async () => {
    try {
      const citasData = await getCitas();
      const sucData = await getSucursales();
      const mecData = await getMecanicos();

      setCitas(citasData || []);
      setSucursales(sucData || []);
      setMecanicos(mecData || []);
    } catch (err) {
      console.error(err);
      setError("Error cargando datos");
    }
  };

  // 🔥 FILTRAR MECÁNICOS POR SUCURSAL
  const mecanicosFiltrados = mecanicos.filter(
    (m) => m.sucursal_id == nueva.sucursal_id
  );

  // 🔥 CREAR CITA (CORREGIDO)
  const handleCrear = async () => {
    setError("");

    // VALIDACIÓN
    if (
      !nueva.sucursal_id ||
      !nueva.mecanico_id ||
      !nueva.vehiculo_id ||
      !nueva.fecha ||
      !nueva.hora
    ) {
      setError("Todos los campos son obligatorios");
      return;
    }

    try {
      // 🔥 CONVERTIR A DATETIME
      const fechaHoraInicio = `${nueva.fecha}T${nueva.hora}:00`;

      const fechaFin = new Date(fechaHoraInicio);
      fechaFin.setHours(fechaFin.getHours() + 1);

      const data = {
        sucursal_id: parseInt(nueva.sucursal_id),
        mecanico_id: parseInt(nueva.mecanico_id),
        vehiculo_id: parseInt(nueva.vehiculo_id),
        fecha_hora_inicio: fechaHoraInicio,
        fecha_hora_fin: fechaFin.toISOString(),
      };

      await crearCita(data);

      // 🔄 LIMPIAR FORMULARIO
      setNueva({
        sucursal_id: "",
        mecanico_id: "",
        vehiculo_id: "",
        fecha: "",
        hora: "",
      });

      cargarTodo();
    } catch (err) {
      console.error(err);
      setError("Error al crear la cita");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📅 Crear Cita</h1>

      {error && (
        <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>
      )}

      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        
        {/* 🏢 SUCURSAL */}
        <select
          value={nueva.sucursal_id}
          onChange={(e) =>
            setNueva({ ...nueva, sucursal_id: e.target.value })
          }
        >
          <option value="">Seleccionar sucursal</option>
          {sucursales.map((s) => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>

        {/* 🔧 MECÁNICO */}
        <select
          value={nueva.mecanico_id}
          onChange={(e) =>
            setNueva({ ...nueva, mecanico_id: e.target.value })
          }
        >
          <option value="">Seleccionar mecánico</option>
          {mecanicosFiltrados.map((m) => (
            <option key={m.id} value={m.id}>
              {m.nombre}
            </option>
          ))}
        </select>

        {/* 🚗 VEHÍCULO */}
        <input
          type="number"
          placeholder="Vehículo ID"
          value={nueva.vehiculo_id}
          onChange={(e) =>
            setNueva({ ...nueva, vehiculo_id: e.target.value })
          }
        />

        {/* 📅 FECHA */}
        <input
          type="date"
          value={nueva.fecha}
          onChange={(e) =>
            setNueva({ ...nueva, fecha: e.target.value })
          }
        />

        {/* ⏰ HORA */}
        <input
          type="time"
          value={nueva.hora}
          onChange={(e) =>
            setNueva({ ...nueva, hora: e.target.value })
          }
        />

        <button onClick={handleCrear}>
          Crear
        </button>
      </div>

      {/* 📋 LISTA */}
      <h2 style={{ marginTop: "30px" }}>Lista de Citas</h2>

      <table border="1" cellPadding="5">
        <thead>
          <tr>
            <th>ID</th>
            <th>Sucursal</th>
            <th>Mecánico</th>
            <th>Inicio</th>
            <th>Fin</th>
          </tr>
        </thead>

        <tbody>
          {citas.map((c) => (
            <tr key={c.id}>
              <td>{c.id}</td>
              <td>{c.sucursal_id}</td>
              <td>{c.mecanico_id}</td>
              <td>{c.fecha_hora_inicio}</td>
              <td>{c.fecha_hora_fin}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Citas;