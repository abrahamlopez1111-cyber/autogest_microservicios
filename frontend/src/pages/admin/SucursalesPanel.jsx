import { useState, useEffect } from "react";
import { crearSucursal, getSucursales } from "../../services/citasApi";

function SucursalesPanel({ volver }) {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [msg, setMsg] = useState({ texto: "", tipo: "" });

  const [nueva, setNueva] = useState({
    nombre: "",
    pais: "",
    capacidad_elevadores: "",
  });

  const mostrar = (texto, tipo = "success") => {
    setMsg({ texto, tipo });
    setTimeout(() => setMsg({ texto: "", tipo: "" }), 4000);
  };

  const cargarSucursales = async () => {
    setCargando(true);
    try {
      const data = await getSucursales();
      setSucursales(Array.isArray(data) ? data : []);
    } catch (error) {
      mostrar("Error cargando sucursales: " + error.message, "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarSucursales(); }, []);

  const handleCrear = async () => {
    if (!nueva.nombre || !nueva.pais || !nueva.capacidad_elevadores) {
      mostrar("Completa todos los campos", "error");
      return;
    }
    if (isNaN(Number(nueva.capacidad_elevadores)) || Number(nueva.capacidad_elevadores) < 1) {
      mostrar("La capacidad debe ser un número mayor a 0", "error");
      return;
    }
    try {
      setLoading(true);
      await crearSucursal({
        nombre: nueva.nombre.trim(),
        pais: nueva.pais.trim(),
        capacidad_elevadores: Number(nueva.capacidad_elevadores),
      });
      mostrar("Sucursal creada correctamente ✅");
      setNueva({ nombre: "", pais: "", capacidad_elevadores: "" });
      await cargarSucursales();
    } catch (error) {
      mostrar("Error al crear sucursal: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏢 Gestión de Sucursales</h2>

      {msg.texto && (
        <div style={{ ...styles.toast, background: msg.tipo === "error" ? "#dc2626" : "#16a34a" }}>
          {msg.texto}
        </div>
      )}

      <div style={styles.card}>
        <h3>Crear Sucursal</h3>
        <div style={styles.form}>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Nombre</label>
            <input style={styles.input} placeholder="Ej: Sucursal Norte"
              value={nueva.nombre}
              onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>País</label>
            <input style={styles.input} placeholder="Ej: Colombia"
              value={nueva.pais}
              onChange={(e) => setNueva({ ...nueva, pais: e.target.value })} />
          </div>
          <div style={styles.fieldGroup}>
            <label style={styles.label}>Capacidad de elevadores</label>
            <input style={styles.input} type="number" min="1" placeholder="Ej: 4"
              value={nueva.capacidad_elevadores}
              onChange={(e) => setNueva({ ...nueva, capacidad_elevadores: e.target.value })} />
          </div>
          <button style={styles.btnCrear} onClick={handleCrear} disabled={loading}>
            {loading ? "Creando..." : "➕ Crear Sucursal"}
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h3>Lista de Sucursales ({sucursales.length})</h3>
        {cargando ? (
          <p style={{ color: "#9ca3af" }}>Cargando...</p>
        ) : sucursales.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>No hay sucursales registradas</p>
        ) : (
          sucursales.map((s) => (
            <div key={s.id} style={styles.item}>
              <div>
                <strong>{s.nombre}</strong>
                <p style={styles.sub}>🌎 {s.pais}</p>
              </div>
              <span style={styles.badge}>🔧 {s.capacidad_elevadores} elevadores</span>
            </div>
          ))
        )}
      </div>

      <button style={styles.btnVolver} onClick={volver}>⬅ Volver</button>
    </div>
  );
}

const styles = {
  container: { padding: "20px", maxWidth: "900px", margin: "auto", color: "white" },
  title: { textAlign: "center", marginBottom: "20px" },
  card: { background: "#1f2937", padding: "20px", borderRadius: "12px", marginBottom: "20px" },
  form: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", alignItems: "end" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "4px" },
  label: { fontSize: "12px", color: "#9ca3af" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #374151", background: "#111827", color: "white", width: "100%", boxSizing: "border-box" },
  btnCrear: { background: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "12px 18px", cursor: "pointer", fontWeight: "bold", height: "46px" },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", padding: "12px 0", borderBottom: "1px solid #374151", flexWrap: "wrap" },
  sub: { margin: "4px 0 0", fontSize: "12px", color: "#9ca3af" },
  badge: { background: "#10b981", padding: "6px 12px", borderRadius: "6px", fontSize: "12px" },
  btnVolver: { background: "#374151", color: "white", border: "none", padding: "12px 18px", borderRadius: "8px", cursor: "pointer" },
  toast: { position: "fixed", top: "20px", right: "20px", padding: "12px 20px", color: "white", borderRadius: "10px", fontWeight: "bold", zIndex: 9999, boxShadow: "0 5px 15px rgba(0,0,0,0.3)", maxWidth: "380px" },
};

export default SucursalesPanel;