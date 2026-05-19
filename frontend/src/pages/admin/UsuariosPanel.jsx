import { useState, useEffect } from "react";
import {
  crearUsuario,
  getUsuarios,
  eliminarUsuario,
} from "../../services/usuariosApi";

function UsuariosPanel({ volver }) {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingLista, setLoadingLista] = useState(false);
  const [msg, setMsg] = useState({ texto: "", tipo: "" });

  const [nuevo, setNuevo] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "cliente",
  });

  const mostrar = (texto, tipo = "success") => {
    setMsg({ texto, tipo });
    setTimeout(() => setMsg({ texto: "", tipo: "" }), 3000);
  };

  const emailValido = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const cargarUsuarios = async () => {
    try {
      setLoadingLista(true);
      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch {
      mostrar("Error cargando usuarios", "error");
    } finally {
      setLoadingLista(false);
    }
  };

  useEffect(() => { cargarUsuarios(); }, []);

  const handleCrear = async () => {
    if (!nuevo.nombre || !nuevo.email || !nuevo.password) {
      mostrar("Completa todos los campos", "error");
      return;
    }
    if (!emailValido(nuevo.email)) {
      mostrar("Correo inválido", "error");
      return;
    }
    try {
      setLoading(true);
      await crearUsuario(nuevo);
      mostrar("Usuario creado correctamente");
      setNuevo({ nombre: "", email: "", password: "", rol: "cliente" });
      await cargarUsuarios();
    } catch {
      mostrar("No se pudo crear el usuario", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleEliminar = async (id) => {
    try {
      setLoading(true);
      await eliminarUsuario(id);
      mostrar("Usuario eliminado");
      await cargarUsuarios();
    } catch {
      mostrar("No se pudo eliminar", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👤 Gestión de Usuarios</h2>

      {msg.texto && (
        <div style={{ ...styles.toast, background: msg.tipo === "error" ? "#dc2626" : "#16a34a" }}>
          {msg.texto}
        </div>
      )}

      <div style={styles.card}>
        <h3 style={styles.subtitle}>Crear Usuario</h3>
        <div style={styles.form}>
          <input style={styles.input} placeholder="Nombre" value={nuevo.nombre}
            onChange={(e) => setNuevo({ ...nuevo, nombre: e.target.value })} />
          <input style={styles.input} placeholder="Correo" value={nuevo.email}
            onChange={(e) => setNuevo({ ...nuevo, email: e.target.value })} />
          <input style={styles.input} type="password" placeholder="Contraseña" value={nuevo.password}
            onChange={(e) => setNuevo({ ...nuevo, password: e.target.value })} />
          <select style={styles.input} value={nuevo.rol}
            onChange={(e) => setNuevo({ ...nuevo, rol: e.target.value })}>
            <option value="cliente">Cliente</option>
            <option value="mecanico">Mecánico</option>
            <option value="admin">Administrador</option>
            <option value="recepcionista">Recepcionista</option>
          </select>
          <button style={styles.btnCrear} onClick={handleCrear} disabled={loading}>
            {loading ? "Procesando..." : "➕ Crear Usuario"}
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.subtitle}>Usuarios Registrados</h3>
        {loadingLista ? (
          <p>Cargando...</p>
        ) : usuarios.length === 0 ? (
          <p style={styles.empty}>No hay usuarios registrados</p>
        ) : (
          usuarios.map((u) => (
            <div key={u.id_usuarios} style={styles.userCard}>
              <div style={styles.userInfo}>
                <strong>{u.nombre}</strong>
                <p style={styles.email}>{u.email}</p>
                <span style={styles.badge(u.rol)}>{u.rol}</span>
              </div>
              <button style={styles.btnDelete}
                onClick={() => handleEliminar(u.id_usuarios)} disabled={loading}>
                🗑
              </button>
            </div>
          ))
        )}
      </div>

      <button style={styles.btnVolver} onClick={volver}>⬅ Volver</button>
    </div>
  );
}

const styles = {
  container: { width: "100%", maxWidth: "1000px", margin: "auto", padding: "15px", color: "white", boxSizing: "border-box" },
  title: { textAlign: "center", marginBottom: "20px", fontSize: "clamp(22px, 4vw, 32px)" },
  subtitle: { marginBottom: "15px" },
  card: { background: "#1f2937", padding: "20px", borderRadius: "16px", marginBottom: "20px" },
  form: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "12px" },
  input: { width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #374151", background: "#111827", color: "white", boxSizing: "border-box" },
  btnCrear: { background: "#2563eb", color: "white", border: "none", borderRadius: "10px", cursor: "pointer", minHeight: "46px" },
  userCard: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "15px", flexWrap: "wrap", padding: "15px 0", borderBottom: "1px solid #374151" },
  userInfo: { flex: 1 },
  email: { color: "#9ca3af", fontSize: "13px", wordBreak: "break-word" },
  empty: { color: "#9ca3af" },
  badge: (rol) => ({
    background: rol === "admin" ? "#ef4444" : rol === "mecanico" ? "#2563eb" : rol === "recepcionista" ? "#8b5cf6" : "#10b981",
    color: "white", padding: "5px 10px", borderRadius: "8px", fontSize: "12px",
  }),
  btnDelete: { background: "#ef4444", color: "white", border: "none", padding: "10px 14px", borderRadius: "8px", cursor: "pointer" },
  btnVolver: { width: "100%", background: "#374151", color: "white", border: "none", padding: "14px", borderRadius: "10px", cursor: "pointer" },
  toast: { position: "fixed", top: "20px", right: "20px", padding: "12px 20px", color: "white", borderRadius: "10px", fontWeight: "bold", zIndex: 9999, boxShadow: "0 5px 15px rgba(0,0,0,0.3)" },
};

export default UsuariosPanel;