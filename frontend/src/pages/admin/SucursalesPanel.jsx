import { useState, useEffect } from "react";
import { crearSucursal, getSucursales } from "../../services/citasApi";

function SucursalesPanel({ volver }) {
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ texto: "", tipo: "" });

  const [nueva, setNueva] = useState({
    nombre: "",
    pais: "",
    capacidad_elevadores: "",
  });

  const mostrar = (texto, tipo = "success") => {
    setMsg({ texto, tipo });
    setTimeout(() => setMsg({ texto: "", tipo: "" }), 3000);
  };

  const cargarSucursales = async () => {
    setLoading(true);
    try {
      const data = await getSucursales();
      setSucursales(Array.isArray(data) ? data : []);
    } catch {
      mostrar("Error cargando sucursales", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarSucursales(); }, []);

  const handleCrear = async () => {
    if (!nueva.nombre || !nueva.pais || !nueva.capacidad_elevadores) {
      mostrar("Completa todos los campos", "error");
      return;
    }
    try {
      await crearSucursal({
        ...nueva,
        capacidad_elevadores: Number(nueva.capacidad_elevadores),
      });
      mostrar("Sucursal creada correctamente");
      setNueva({ nombre: "", pais: "", capacidad_elevadores: "" });
      cargarSucursales();
    } catch {
      mostrar("Error creando sucursal", "error");
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
          <input style={styles.input} placeholder="Nombre" value={nueva.nombre}
            onChange={(e) => setNueva({ ...nueva, nombre: e.target.value })} />
          <input style={styles.input} placeholder="País" value={nueva.pais}
            onChange={(e) => setNueva({ ...nueva, pais: e.target.value })} />
          <input style={styles.input} type="number" placeholder="Capacidad elevadores"
            value={nueva.capacidad_elevadores}
            onChange={(e) => setNueva({ ...nueva, capacidad_elevadores: e.target.value })} />
          <button style={styles.btnCrear} onClick={handleCrear}>➕ Crear</button>
        </div>
      </div>

      <div style={styles.card}>
        <h3>Lista de Sucursales</h3>
        {loading ? (
          <p>Cargando...</p>
        ) : sucursales.length === 0 ? (
          <p>No hay sucursales</p>
        ) : (
          sucursales.map((s) => (
            <div key={s.id} style={styles.item}>
              <strong>{s.nombre}</strong>
              <p style={styles.sub}>{s.pais}</p>
              <span style={styles.badge}>Elevadores: {s.capacidad_elevadores}</span>
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
  form: { display: "flex", flexWrap: "wrap", gap: "10px" },
  input: { flex: "1", minWidth: "180px", padding: "12px", borderRadius: "8px", border: "1px solid #374151", background: "#111827", color: "white" },
  btnCrear: { background: "#2563eb", color: "white", border: "none", borderRadius: "8px", padding: "12px 18px", cursor: "pointer" },
  item: { padding: "12px 0", borderBottom: "1px solid #374151" },
  sub: { margin: 0, fontSize: "12px", color: "#9ca3af" },
  badge: { background: "#10b981", padding: "4px 8px", borderRadius: "6px", fontSize: "12px", marginTop: "5px", display: "inline-block" },
  btnVolver: { background: "#374151", color: "white", border: "none", borderRadius: "8px", padding: "12px 18px", cursor: "pointer" },
  toast: { position: "fixed", top: "20px", right: "20px", padding: "12px 20px", color: "white", borderRadius: "10px", fontWeight: "bold", zIndex: 9999, boxShadow: "0 5px 15px rgba(0,0,0,0.3)" },
};

export default SucursalesPanel;