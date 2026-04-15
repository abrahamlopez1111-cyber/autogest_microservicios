/* eslint-disable react-hooks/purity */
import { useState } from "react";

function VehiculosPanel() {

  const [vehiculos, setVehiculos] = useState([
    { id: 1, placa: "ABC123", marca: "Toyota", modelo: "Corolla", sucursal: "Sucursal Norte", estado: "Activo" },
    { id: 2, placa: "XYZ456", marca: "Chevrolet", modelo: "Spark", sucursal: "Sucursal Centro", estado: "En mantenimiento" },
  ]);

  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [sucursal, setSucursal] = useState("");
  const [estado, setEstado] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null);

  // FILTRO DE BUSQUEDA
  const vehiculosFiltrados = vehiculos.filter(v =>
    v.placa.toLowerCase().includes(busqueda.toLowerCase()) ||
    v.marca.toLowerCase().includes(busqueda.toLowerCase())
  );

  // AGREGAR
  const agregarVehiculo = () => {

    if (!placa || !marca || !modelo || !sucursal || !estado) {
      alert("Complete todos los campos");
      return;
    }

    const nuevo = {
      id: Date.now(),
      placa,
      marca,
      modelo,
      sucursal,
      estado
    };

    setVehiculos([...vehiculos, nuevo]);

    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setPlaca("");
    setMarca("");
    setModelo("");
    setSucursal("");
    setEstado("");
    setEditando(null);
  };

  // ELIMINAR
  const eliminarVehiculo = (id) => {
    setVehiculos(vehiculos.filter(v => v.id !== id));
  };

  // EDITAR
  const editarVehiculo = (vehiculo) => {

    setPlaca(vehiculo.placa);
    setMarca(vehiculo.marca);
    setModelo(vehiculo.modelo);
    setSucursal(vehiculo.sucursal);
    setEstado(vehiculo.estado);

    setEditando(vehiculo.id);
  };

  // GUARDAR EDICION
  const guardarEdicion = () => {

    const actualizados = vehiculos.map(v => {

      if (v.id === editando) {
        return {
          ...v,
          placa,
          marca,
          modelo,
          sucursal,
          estado
        };
      }

      return v;
    });

    setVehiculos(actualizados);

    limpiarFormulario();
  };

  return (

    <div style={styles.container}>

      <h2 style={styles.title}>🚗 Gestión de Vehículos</h2>

      {/* BUSCADOR */}

      <input
        style={styles.buscar}
        placeholder="Buscar por placa o marca..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* FORMULARIO */}

      <div style={styles.form}>

        <input
          style={styles.input}
          placeholder="Placa"
          value={placa}
          onChange={(e) => setPlaca(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Marca"
          value={marca}
          onChange={(e) => setMarca(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Modelo"
          value={modelo}
          onChange={(e) => setModelo(e.target.value)}
        />

        {/* SUCURSAL */}

        <select
          style={styles.input}
          value={sucursal}
          onChange={(e) => setSucursal(e.target.value)}
        >
          <option value="">Seleccione sucursal</option>
          <option value="Sucursal Norte">Sucursal Norte</option>
          <option value="Sucursal Centro">Sucursal Centro</option>
        </select>

        {/* ESTADO */}

        <select
          style={styles.input}
          value={estado}
          onChange={(e) => setEstado(e.target.value)}
        >
          <option value="">Seleccione estado</option>
          <option value="Activo">Activo</option>
          <option value="En mantenimiento">En mantenimiento</option>
          <option value="Fuera de servicio">Fuera de servicio</option>
        </select>

        {editando ? (

          <button style={styles.btnGuardar} onClick={guardarEdicion}>
            Guardar cambios
          </button>

        ) : (

          <button style={styles.btnAgregar} onClick={agregarVehiculo}>
            Agregar vehículo
          </button>

        )}

      </div>

      {/* TABLA */}

      <table style={styles.table}>

        <thead>
          <tr>
            <th>Placa</th>
            <th>Marca</th>
            <th>Modelo</th>
            <th>Sucursal</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {vehiculosFiltrados.map((v) => (

            <tr key={v.id}>

              <td>{v.placa}</td>
              <td>{v.marca}</td>
              <td>{v.modelo}</td>
              <td>{v.sucursal}</td>
              <td>{v.estado}</td>

              <td>

                <button
                  style={styles.btnEditar}
                  onClick={() => editarVehiculo(v)}
                >
                  ✏️
                </button>

                <button
                  style={styles.btnEliminar}
                  onClick={() => eliminarVehiculo(v.id)}
                >
                  🗑
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

const styles = {

  container: {
    maxWidth: "1100px",
    margin: "auto",
    background: "#1f2937",
    padding: "30px",
    borderRadius: "12px"
  },

  title: {
    textAlign: "center",
    marginBottom: "20px"
  },

  buscar: {
    width: "100%",
    padding: "10px",
    marginBottom: "20px",
    borderRadius: "8px",
    border: "none"
  },

  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "25px"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    width: "150px"
  },

  btnAgregar: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  btnGuardar: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#111827"
  },

  btnEditar: {
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "5px 10px",
    marginRight: "5px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  btnEliminar: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  }

};

export default VehiculosPanel;