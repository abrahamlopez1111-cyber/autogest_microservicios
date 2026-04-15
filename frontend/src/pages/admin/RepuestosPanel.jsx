import React, { useState } from "react";

function RepuestosPanel() {

  const [repuestos, setRepuestos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);

  const [form, setForm] = useState({
    nombre: "",
    precio: "",
    stock: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // AGREGAR
  const agregarRepuesto = () => {

    if (!form.nombre || !form.precio || !form.stock) {
      alert("Complete todos los campos");
      return;
    }

    const nuevoRepuesto = {
      id: repuestos.length + 1,
      nombre: form.nombre,
      precio: form.precio,
      stock: form.stock
    };

    setRepuestos([...repuestos, nuevoRepuesto]);

    setForm({
      nombre: "",
      precio: "",
      stock: ""
    });
  };

  // ELIMINAR
  const eliminarRepuesto = (id) => {
    setRepuestos(repuestos.filter(r => r.id !== id));
  };

  // EDITAR
  const editarRepuesto = (repuesto) => {
    setForm({
      nombre: repuesto.nombre,
      precio: repuesto.precio,
      stock: repuesto.stock
    });

    setEditandoId(repuesto.id);
  };

  // GUARDAR EDICIÓN
  const guardarEdicion = () => {

    const nuevos = repuestos.map(r => {
      if (r.id === editandoId) {
        return {
          ...r,
          nombre: form.nombre,
          precio: form.precio,
          stock: form.stock
        };
      }
      return r;
    });

    setRepuestos(nuevos);
    setEditandoId(null);

    setForm({
      nombre: "",
      precio: "",
      stock: ""
    });
  };

  return (
    <div style={styles.container}>

      <h2 style={styles.title}>🧰 Gestión de Repuestos</h2>

      {/* FORMULARIO */}
      <div style={styles.form}>

        <input
          type="text"
          name="nombre"
          placeholder="Nombre del repuesto"
          value={form.nombre}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="number"
          name="precio"
          placeholder="Precio"
          value={form.precio}
          onChange={handleChange}
          style={styles.input}
        />

        <input
          type="number"
          name="stock"
          placeholder="Stock"
          value={form.stock}
          onChange={handleChange}
          style={styles.input}
        />

        {editandoId ? (
          <button style={styles.editBtn} onClick={guardarEdicion}>
            💾 Guardar
          </button>
        ) : (
          <button style={styles.addBtn} onClick={agregarRepuesto}>
            ➕ Agregar
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

          {repuestos.length === 0 ? (
            <tr>
              <td colSpan="4">No hay repuestos registrados</td>
            </tr>
          ) : (
            repuestos.map((r) => (
              <tr key={r.id}>
                <td>{r.nombre}</td>
                <td>${r.precio}</td>
                <td>{r.stock}</td>

                <td>

                  <button
                    style={styles.editBtn}
                    onClick={() => editarRepuesto(r)}
                  >
                    Editar
                  </button>

                  <button
                    style={styles.deleteBtn}
                    onClick={() => eliminarRepuesto(r.id)}
                  >
                    Eliminar
                  </button>

                </td>

              </tr>
            ))
          )}

        </tbody>

      </table>

    </div>
  );
}

const styles = {

  container: {
    background: "#1f2937",
    padding: "30px",
    borderRadius: "12px",
    textAlign: "center"
  },

  title: {
    marginBottom: "25px"
  },

  form: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "30px",
    flexWrap: "wrap"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "none",
    width: "180px"
  },

  addBtn: {
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  editBtn: {
    background: "#f59e0b",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    marginRight: "5px",
    cursor: "pointer"
  },

  deleteBtn: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 12px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#111827",
    color: "white"
  }

};

export default RepuestosPanel;