import { useEffect, useState } from "react";

const GATEWAY = "https://autogest-gateway.onrender.com";

function RecepcionistasPanel({ volver }) {
  const [usuarios, setUsuarios] = useState([]);
  const [recepcionistasDB, setRecepcionistasDB] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [disponibles, setDisponibles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [msg, setMsg] = useState({ texto: "", tipo: "" });
  const [nuevo, setNuevo] = useState({ usuario_id: "", sucursal_id: "" });

  const mostrar = (texto, tipo = "success") => {
    setMsg({ texto, tipo });
    setTimeout(() => setMsg({ texto: "", tipo: "" }), 4000);
  };

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [resUsuarios, resRecep, resSuc] = await Promise.all([
        fetch(`${GATEWAY}/usuarios`),
        fetch(`${GATEWAY}/recepcionistas`),
        fetch(`${GATEWAY}/sucursales`),
      ]);

      if (!resUsuarios.ok || !resRecep.ok || !resSuc.ok) {
        const errTexts = await Promise.all([
          !resUsuarios.ok ? resUsuarios.text() : Promise.resolve(""),
          !resRecep.ok ? resRecep.text() : Promise.resolve(""),
          !resSuc.ok ? resSuc.text() : Promise.resolve(""),
        ]);
        throw new Error("Error cargando: " + errTexts.filter(Boolean).join(" | "));
      }

      const usuariosData = await resUsuarios.json();
      const recepcionistasData = await resRecep.json();
      const sucursalesData = await resSuc.json();

      const usuariosRecep = usuariosData.filter((u) => u.rol === "recepcionista");
      const idsAsignados = recepcionistasData.map((r) => r.usuario_id);
      const usuariosDisponibles = usuariosRecep.filter(
        (u) => !idsAsignados.includes(u.id_usuarios)
      );

      setUsuarios(usuariosData);
      setRecepcionistasDB(recepcionistasData);
      setSucursales(sucursalesData);
      setDisponibles(usuariosDisponibles);
    } catch (error) {
      mostrar("Error cargando información: " + error.message, "error");
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleCrear = async () => {
    if (!nuevo.usuario_id || !nuevo.sucursal_id) {
      mostrar("Selecciona recepcionista y sucursal", "error");
      return;
    }
    try {
      setLoading(true);
      const res = await fetch(`${GATEWAY}/recepcionistas`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id: Number(nuevo.usuario_id),
          sucursal_id: Number(nuevo.sucursal_id),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        mostrar("Error: " + (data.detail || "No se pudo asignar"), "error");
        return;
      }

      mostrar("Recepcionista asignada correctamente ✅");
      setNuevo({ usuario_id: "", sucursal_id: "" });
      await cargarDatos();
    } catch (error) {
      mostrar("Error de conexión: " + error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  const eliminar = async (id) => {
    try {
      setLoading(true);
      const res = await fetch(`${GATEWAY}/recepcionistas/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json();
        mostrar("Error: " + (data.detail || "No se pudo eliminar"), "error");
        return;
      }
      mostrar("Asignación eliminada");
      await cargarDatos();
    } catch (error) {
      mostrar("Error de conexión", "error");
    } finally {
      setLoading(false);
    }
  };

  const getNombreUsuario = (id) =>
    usuarios.find((u) => u.id_usuarios === id)?.nombre || "Desconocido";

  const getNombreSucursal = (id) =>
    sucursales.find((s) => s.id === id)?.nombre || "Desconocida";

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧑‍💼 Gestión de Recepcionistas</h2>

      {msg.texto && (
        <div style={{ ...styles.toast, background: msg.tipo === "error" ? "#dc2626" : "#16a34a" }}>
          {msg.texto}
        </div>
      )}

      <div style={styles.card}>
        <h3>Asignar Recepcionista a Sucursal</h3>
        {cargando ? (
          <p style={{ color: "#9ca3af" }}>Cargando datos...</p>
        ) : (
          <div style={styles.form}>
            <select style={styles.input} value={nuevo.usuario_id}
              onChange={(e) => setNuevo({ ...nuevo, usuario_id: e.target.value })}>
              <option value="">— Seleccione recepcionista —</option>
              {disponibles.length === 0 && (
                <option disabled>No hay recepcionistas disponibles</option>
              )}
              {disponibles.map((u) => (
                <option key={u.id_usuarios} value={u.id_usuarios}>{u.nombre}</option>
              ))}
            </select>

            <select style={styles.input} value={nuevo.sucursal_id}
              onChange={(e) => setNuevo({ ...nuevo, sucursal_id: e.target.value })}>
              <option value="">— Seleccione sucursal —</option>
              {sucursales.length === 0 && (
                <option disabled>No hay sucursales creadas</option>
              )}
              {sucursales.map((s) => (
                <option key={s.id} value={s.id}>{s.nombre}</option>
              ))}
            </select>

            <button style={styles.btnCrear} onClick={handleCrear} disabled={loading}>
              {loading ? "Asignando..." : "➕ Asignar"}
            </button>
          </div>
        )}
      </div>

      <div style={styles.card}>
        <h3>Recepcionistas Asignadas</h3>
        {cargando ? (
          <p>Cargando...</p>
        ) : recepcionistasDB.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>No hay recepcionistas asignadas</p>
        ) : (
          recepcionistasDB.map((r) => (
            <div key={r.id} style={styles.item}>
              <div>
                <strong>{getNombreUsuario(r.usuario_id)}</strong>
                <p style={styles.sub}>📍 {getNombreSucursal(r.sucursal_id)}</p>
              </div>
              <button style={styles.btnEliminar}
                onClick={() => eliminar(r.id)} disabled={loading}>❌</button>
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
  input: { flex: "1", minWidth: "220px", padding: "12px", borderRadius: "8px", border: "1px solid #374151", background: "#111827", color: "white" },
  btnCrear: { padding: "12px 18px", borderRadius: "8px", border: "none", background: "#2563eb", color: "white", cursor: "pointer", fontWeight: "bold" },
  item: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", padding: "12px 0", borderBottom: "1px solid #374151" },
  sub: { margin: 0, fontSize: "12px", color: "#9ca3af" },
  btnEliminar: { background: "#ef4444", color: "white", border: "none", borderRadius: "8px", padding: "8px 12px", cursor: "pointer" },
  btnVolver: { background: "#374151", color: "white", border: "none", padding: "12px 18px", borderRadius: "8px", cursor: "pointer" },
  toast: { position: "fixed", top: "20px", right: "20px", padding: "12px 20px", color: "white", borderRadius: "10px", fontWeight: "bold", zIndex: 9999, boxShadow: "0 5px 15px rgba(0,0,0,0.3)", maxWidth: "350px" },
};

export default RecepcionistasPanel;