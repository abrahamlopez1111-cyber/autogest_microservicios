/* eslint-disable react-hooks/purity */
import { useState, useEffect } from "react";

function RepuestosPanel() {

  const [repuestos, setRepuestos] = useState(() => {
    const datos = localStorage.getItem("repuestos");
    return datos ? JSON.parse(datos) : [];
  });

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const [busqueda, setBusqueda] = useState("");
  const [editando, setEditando] = useState(null);

  useEffect(() => {
    localStorage.setItem("repuestos", JSON.stringify(repuestos));
  }, [repuestos]);

  const repuestosFiltrados = repuestos.filter(r =>
    r.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const agregarRepuesto = () => {

    if (!nombre || !precio || !stock) {
      alert("Complete todos los campos");
      return;
    }

    const nuevo = {
      id: Date.now(),
      nombre,
      precio,
      stock
    };

    setRepuestos([...repuestos, nuevo]);

    limpiarFormulario();
  };

  const limpiarFormulario = () => {
    setNombre("");
    setPrecio("");
    setStock("");
    setEditando(null);
  };

  const eliminarRepuesto = (id) => {
    setRepuestos(repuestos.filter(r => r.id !== id));
  };

  const editarRepuesto = (repuesto) => {
    setNombre(repuesto.nombre);
    setPrecio(repuesto.precio);
    setStock(repuesto.stock);
    setEditando(repuesto.id);
  };

  const guardarEdicion = () => {

    const actualizados = repuestos.map(r => {

      if (r.id === editando) {
        return {
          ...r,
          nombre,
          precio,
          stock
        };
      }

      return r;
    });

    setRepuestos(actualizados);

    limpiarFormulario();
  };

  return (

    <div style={styles.container}>

      {/* BARRA SUPERIOR */}

      <div style={styles.topBar}>

        <h3 style={{ margin: 0 }}>Panel de Administrador</h3>

        <button
          style={styles.btnVolver}
          onClick={() => window.history.back()}
        >
          ← Volver
        </button>

      </div>

      <h2 style={styles.title}>🔧 Gestión de Repuestos</h2>

      {/* BUSCADOR */}

      <input
        style={styles.buscar}
        placeholder="Buscar repuesto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {/* FORMULARIO */}

      <div style={styles.form}>

        <input
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Precio"
          type="number"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />

        <input
          style={styles.input}
          placeholder="Stock"
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
        />

        {editando ? (

          <button style={styles.btnGuardar} onClick={guardarEdicion}>
            Guardar cambios
          </button>

        ) : (

          <button style={styles.btnAgregar} onClick={agregarRepuesto}>
            Agregar repuesto
          </button>

        )}

      </div>

      {/* TABLA */}

      <table style={styles.table}>

        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Acciones</th>
          </tr>
        </thead>

        <tbody>

          {repuestosFiltrados.map((r) => (

            <tr key={r.id}>

              <td>{r.nombre}</td>
              <td>${r.precio}</td>
              <td>{r.stock}</td>

              <td>

                <button
                  style={styles.btnEditar}
                  onClick={() => editarRepuesto(r)}
                >
                  ✏️
                </button>

                <button
                  style={styles.btnEliminar}
                  onClick={() => eliminarRepuesto(r.id)}
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
    borderRadius: "12px",
    color: "white"
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "20px"
  },

  btnVolver: {
    background: "#374151",
    color: "white",
    border: "none",
    padding: "8px 15px",
    borderRadius: "6px",
    cursor: "pointer"
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

export default RepuestosPanel;