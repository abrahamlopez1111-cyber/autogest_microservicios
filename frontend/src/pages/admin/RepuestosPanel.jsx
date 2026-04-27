import { useState, useEffect } from "react";

function RepuestosPanel() {

  const API = "http://localhost:8004/inventario/repuestos/inventario-completo";
  const API_CREAR = "http://localhost:8004/inventario/repuestos";
  const API_STOCK = "http://localhost:8004/inventario/repuestos/stock";
  const API_SUCURSALES = "http://localhost:8000/sucursales";

  const [datos, setDatos] = useState([]);
  const [sucursales, setSucursales] = useState([]);

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [sucursalId, setSucursalId] = useState("");

  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarDatos();
    obtenerSucursales();
  }, []);

  // =========================
  // 📦 INVENTARIO COMPLETO
  // =========================
  const cargarDatos = async () => {
    try {
      const res = await fetch(API);
      const data = await res.json();
      setDatos(data);
    } catch {
      alert("Error al cargar inventario");
    }
  };

  // =========================
  // 🏬 SUCURSALES
  // =========================
  const obtenerSucursales = async () => {
    const res = await fetch(API_SUCURSALES);
    const data = await res.json();
    setSucursales(data);
  };

  // =========================
  // ➕ CREAR + STOCK
  // =========================
  const agregar = async () => {

    if (!nombre || !precio || !cantidad || !sucursalId) {
      alert("Complete todos los campos");
      return;
    }

    try {

      // 1️⃣ crear producto
      const resProducto = await fetch(API_CREAR + "/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre,
          precio: Number(precio)
        })
      });

      const producto = await resProducto.json();

      // 2️⃣ asignar stock
      await fetch(API_STOCK, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sucursal_id: Number(sucursalId),
          catalogo_repuestos_id: producto.id,
          cantidad_disponible: Number(cantidad)
        })
      });

      alert("Guardado correctamente");

      limpiar();
      cargarDatos();

    } catch {
      alert("Error al guardar");
    }
  };

  const limpiar = () => {
    setNombre("");
    setPrecio("");
    setCantidad("");
    setSucursalId("");
  };

  // =========================
  // 🔍 FILTRO
  // =========================
  const filtrados = datos.filter(d =>
    d.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  // =========================
  // 🏬 OBTENER NOMBRE SUCURSAL
  // =========================
  const nombreSucursal = (id) => {
    const s = sucursales.find(s => s.id === id);
    return s ? s.nombre : "N/A";
  };

  return (

    <div style={styles.container}>

      <h2 style={styles.title}>📦 Inventario por Sucursal</h2>

      {/* BUSCADOR */}
      <input
        style={styles.buscar}
        placeholder="Buscar producto..."
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
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) => setPrecio(e.target.value)}
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => setCantidad(e.target.value)}
        />

        <select
          style={styles.input}
          value={sucursalId}
          onChange={(e) => setSucursalId(e.target.value)}
        >
          <option value="">Seleccione sucursal</option>
          {sucursales.map(s => (
            <option key={s.id} value={s.id}>
              {s.nombre}
            </option>
          ))}
        </select>

        <button style={styles.btnAgregar} onClick={agregar}>
          Agregar
        </button>

      </div>

      {/* TABLA FINAL 🔥 */}
      <table style={styles.table}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Cantidad</th>
            <th>Sucursal</th>
          </tr>
        </thead>

        <tbody>
          {filtrados.map(item => (
            <tr key={item.id}>
              <td>{item.nombre}</td>
              <td>${item.precio}</td>
              <td>{item.cantidad}</td>
              <td>{nombreSucursal(item.sucursal_id)}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

const styles = {
  container: { padding: 20, color: "white" },
  title: { textAlign: "center" },
  buscar: { width: "100%", marginBottom: 20 },
  form: { display: "flex", gap: 10, marginBottom: 20 },
  input: { padding: 10 },
  btnAgregar: { background: "green", color: "white" },
  table: { width: "100%", marginTop: 20 }
};

export default RepuestosPanel;