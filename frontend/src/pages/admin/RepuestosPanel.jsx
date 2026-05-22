import { useState, useEffect } from "react";

const API_URL = "https://autogest-gateway.onrender.com";

function RepuestosPanel() {
  const [datos, setDatos] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ texto: "", tipo: "" });

  // Form crear
  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [sucursalId, setSucursalId] = useState("");
  const [busqueda, setBusqueda] = useState("");

  // Edición
  const [editando, setEditando] = useState(null);
  const [editForm, setEditForm] = useState({ nombre: "", precio: "" });
  const [guardando, setGuardando] = useState(false);

  const mostrar = (texto, tipo = "success") => {
    setMsg({ texto, tipo });
    setTimeout(() => setMsg({ texto: "", tipo: "" }), 3500);
  };

  useEffect(() => {
    cargarDatos();
    obtenerSucursales();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/inventario/repuestos/inventario-completo`);
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setDatos(Array.isArray(data) ? data : []);
    } catch (e) {
      mostrar("Error al cargar inventario: " + e.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const obtenerSucursales = async () => {
    try {
      const res = await fetch(`${API_URL}/sucursales`);
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSucursales(Array.isArray(data) ? data : []);
    } catch {
      mostrar("Error cargando sucursales", "error");
    }
  };

  const agregar = async () => {
    if (!nombre || !precio || !cantidad || !sucursalId) {
      mostrar("Complete todos los campos", "error");
      return;
    }
    try {
      const resProducto = await fetch(`${API_URL}/inventario/repuestos/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, precio: Number(precio) }),
      });
      if (!resProducto.ok) {
        const err = await resProducto.json();
        mostrar("Error: " + (err.detail || "No se pudo crear el producto"), "error");
        return;
      }
      const producto = await resProducto.json();

      const resStock = await fetch(`${API_URL}/inventario/repuestos/stock`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sucursal_id: Number(sucursalId),
          catalogo_repuestos_id: producto.id,
          cantidad_disponible: Number(cantidad),
        }),
      });
      if (!resStock.ok) {
        const err = await resStock.json();
        mostrar("Producto creado pero error en stock: " + (err.detail || ""), "error");
        return;
      }

      mostrar("Producto guardado correctamente ✅");
      setNombre(""); setPrecio(""); setCantidad(""); setSucursalId("");
      cargarDatos();
    } catch (e) {
      mostrar("Error de conexión: " + e.message, "error");
    }
  };

  const abrirEdicion = (item) => {
    setEditando(item);
    setEditForm({ nombre: item.nombre, precio: item.precio });
  };

  const guardarEdicion = async () => {
    if (!editForm.nombre || !editForm.precio) {
      mostrar("Completa nombre y precio", "error");
      return;
    }
    try {
      setGuardando(true);
      const res = await fetch(`${API_URL}/inventario/repuestos/${editando.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: editForm.nombre.trim(),
          precio: Number(editForm.precio),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        mostrar("Error: " + (err.detail || "No se pudo actualizar"), "error");
        return;
      }
      mostrar("Producto actualizado ✅");
      setEditando(null);
      cargarDatos();
    } catch (e) {
      mostrar("Error de conexión: " + e.message, "error");
    } finally {
      setGuardando(false);
    }
  };

  const eliminar = async (id, nombre) => {
    if (!window.confirm(`¿Eliminar "${nombre}"?`)) return;
    try {
      const res = await fetch(`${API_URL}/inventario/repuestos/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        const err = await res.json();
        mostrar("Error: " + (err.detail || "No se pudo eliminar"), "error");
        return;
      }
      mostrar("Producto eliminado");
      cargarDatos();
    } catch (e) {
      mostrar("Error de conexión", "error");
    }
  };

  const filtrados = datos.filter((d) =>
    d.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const nombreSucursal = (id) =>
    sucursales.find((s) => s.id === id)?.nombre || "N/A";

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 Inventario por Sucursal</h2>

      {msg.texto && (
        <div style={{ ...styles.toast, background: msg.tipo === "error" ? "#dc2626" : "#16a34a" }}>
          {msg.texto}
        </div>
      )}

      {/* BUSCADOR */}
      <input style={styles.buscar} placeholder="🔍 Buscar producto..."
        value={busqueda} onChange={(e) => setBusqueda(e.target.value)} />

      {/* FORM CREAR */}
      <div style={styles.formCard}>
        <h3 style={styles.formTitle}>Agregar producto</h3>
        <div style={styles.form}>
          <input style={styles.input} placeholder="Nombre" value={nombre}
            onChange={(e) => setNombre(e.target.value)} />
          <input style={styles.input} type="number" placeholder="Precio" value={precio}
            onChange={(e) => setPrecio(e.target.value)} />
          <input style={styles.input} type="number" placeholder="Cantidad" value={cantidad}
            onChange={(e) => setCantidad(e.target.value)} />
          <select style={styles.input} value={sucursalId}
            onChange={(e) => setSucursalId(e.target.value)}>
            <option value="">Seleccione sucursal</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>{s.nombre}</option>
            ))}
          </select>
          <button style={styles.btnAgregar} onClick={agregar}>➕ Agregar</button>
        </div>
      </div>

      {/* TABLA */}
      {loading ? (
        <p style={{ color: "#94a3b8", textAlign: "center" }}>Cargando...</p>
      ) : filtrados.length === 0 ? (
        <p style={{ color: "#94a3b8", textAlign: "center" }}>No hay productos</p>
      ) : (
        <div style={styles.tableContainer}>
          <table style={styles.table}>
            <thead>
              <tr style={styles.thead}>
                <th style={styles.th}>Producto</th>
                <th style={styles.th}>Precio</th>
                <th style={styles.th}>Cantidad</th>
                <th style={styles.th}>Sucursal</th>
                <th style={styles.th}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((item) => (
                <>
                  <tr key={item.id} style={styles.tr}>
                    <td style={styles.td}>{item.nombre}</td>
                    <td style={styles.td}>${Number(item.precio).toLocaleString("es-CO")}</td>
                    <td style={styles.td}>
                      <span style={{ ...styles.stockBadge, background: item.cantidad > 0 ? "#16a34a" : "#dc2626" }}>
                        {item.cantidad ?? 0}
                      </span>
                    </td>
                    <td style={styles.td}>{nombreSucursal(item.sucursal_id)}</td>
                    <td style={styles.td}>
                      <div style={styles.acciones}>
                        <button style={styles.btnEditar} onClick={() => abrirEdicion(item)}>
                          ✏️ Editar
                        </button>
                        <button style={styles.btnEliminar} onClick={() => eliminar(item.id, item.nombre)}>
                          🗑 Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* FILA DE EDICIÓN INLINE */}
                  {editando?.id === item.id && (
                    <tr key={`edit-${item.id}`} style={styles.editRow}>
                      <td colSpan={5} style={styles.editCell}>
                        <div style={styles.editForm}>
                          <div style={styles.editFields}>
                            <div style={styles.fieldGroup}>
                              <label style={styles.label}>Nombre</label>
                              <input style={styles.editInput} value={editForm.nombre}
                                onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })} />
                            </div>
                            <div style={styles.fieldGroup}>
                              <label style={styles.label}>Precio ($)</label>
                              <input style={styles.editInput} type="number" value={editForm.precio}
                                onChange={(e) => setEditForm({ ...editForm, precio: e.target.value })} />
                            </div>
                          </div>
                          <div style={styles.editBotones}>
                            <button style={styles.btnGuardar} onClick={guardarEdicion} disabled={guardando}>
                              {guardando ? "Guardando..." : "💾 Guardar"}
                            </button>
                            <button style={styles.btnCancelar} onClick={() => setEditando(null)}>
                              ✕ Cancelar
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { padding: "20px", color: "white" },
  title: { textAlign: "center", marginBottom: "20px" },
  buscar: { width: "100%", padding: "12px", borderRadius: "8px", marginBottom: "16px", background: "#1e293b", color: "white", border: "1px solid #334155", boxSizing: "border-box" },
  formCard: { background: "#1e293b", padding: "16px 20px", borderRadius: "12px", marginBottom: "20px" },
  formTitle: { margin: "0 0 12px", fontSize: "14px", color: "#94a3b8" },
  form: { display: "flex", flexWrap: "wrap", gap: "10px" },
  input: { flex: "1", minWidth: "160px", padding: "10px 12px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "white" },
  btnAgregar: { background: "#16a34a", color: "white", border: "none", borderRadius: "8px", padding: "10px 18px", cursor: "pointer", fontWeight: "bold" },
  tableContainer: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse" },
  thead: { background: "#1e293b" },
  th: { padding: "12px 14px", textAlign: "left", fontSize: "13px", color: "#94a3b8", fontWeight: "500", borderBottom: "1px solid #334155" },
  tr: { borderBottom: "1px solid #1e293b" },
  td: { padding: "12px 14px", fontSize: "14px", verticalAlign: "middle" },
  stockBadge: { padding: "3px 10px", borderRadius: "20px", fontSize: "12px", color: "white", fontWeight: "500" },
  acciones: { display: "flex", gap: "8px" },
  btnEditar: { background: "#2563eb", color: "white", border: "none", padding: "7px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  btnEliminar: { background: "#dc2626", color: "white", border: "none", padding: "7px 14px", borderRadius: "6px", cursor: "pointer", fontSize: "13px" },
  editRow: { background: "#0f172a" },
  editCell: { padding: "16px 14px" },
  editForm: { display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "flex-end" },
  editFields: { display: "flex", gap: "12px", flexWrap: "wrap", flex: 1 },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "4px", minWidth: "160px" },
  label: { fontSize: "12px", color: "#94a3b8" },
  editInput: { padding: "8px 12px", borderRadius: "6px", border: "1px solid #2563eb", background: "#1e293b", color: "white" },
  editBotones: { display: "flex", gap: "8px", alignItems: "flex-end" },
  btnGuardar: { background: "#16a34a", color: "white", border: "none", padding: "9px 16px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  btnCancelar: { background: "#334155", color: "white", border: "none", padding: "9px 14px", borderRadius: "6px", cursor: "pointer" },
  toast: { position: "fixed", top: "20px", right: "20px", padding: "12px 20px", color: "white", borderRadius: "10px", fontWeight: "bold", zIndex: 9999, boxShadow: "0 5px 15px rgba(0,0,0,0.3)", maxWidth: "360px" },
};

export default RepuestosPanel;