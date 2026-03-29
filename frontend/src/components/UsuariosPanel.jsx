import { useState, useEffect } from "react";
import {
  crearUsuario,
  getUsuarios,
  eliminarUsuario,
} from "../services/usuariosApi";

function UsuariosPanel({ volver }) {
  const [usuarios, setUsuarios] = useState([]);

  const [nuevo, setNuevo] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "cliente",
  });

  const cargarUsuarios = async () => {
    const data = await getUsuarios();
    setUsuarios(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const handleCrear = async () => {
    if (!nuevo.nombre || !nuevo.email || !nuevo.password) {
      alert("Completa todos los campos");
      return;
    }

    await crearUsuario(nuevo);
    setNuevo({ nombre: "", email: "", password: "", rol: "cliente" });
    cargarUsuarios();
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar usuario?")) return;
    await eliminarUsuario(id);
    cargarUsuarios();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>👤 Gestión de Usuarios</h2>

      {/* FORM */}
      <div style={styles.card}>
        <h3>Crear Usuario</h3>

        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Nombre"
            value={nuevo.nombre}
            onChange={(e) =>
              setNuevo({ ...nuevo, nombre: e.target.value })
            }
          />

          <input
            style={styles.input}
            placeholder="Email"
            value={nuevo.email}
            onChange={(e) =>
              setNuevo({ ...nuevo, email: e.target.value })
            }
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Contraseña"
            value={nuevo.password}
            onChange={(e) =>
              setNuevo({ ...nuevo, password: e.target.value })
            }
          />

          <select
            style={styles.input}
            value={nuevo.rol}
            onChange={(e) =>
              setNuevo({ ...nuevo, rol: e.target.value })
            }
          >
            <option value="cliente">Cliente</option>
            <option value="mecanico">Mecánico</option>
            <option value="admin">Administrador</option>
          </select>

          <button style={styles.btnCrear} onClick={handleCrear}>
            ➕ Crear Usuario
          </button>
        </div>
      </div>

      {/* LISTA */}
      <div style={styles.card}>
        <h3>Lista de Usuarios</h3>

        {usuarios.length === 0 ? (
          <p>No hay usuarios</p>
        ) : (
          usuarios.map((u) => (
            <div key={u.id_usuarios} style={styles.userCard}>
              <div>
                <strong>{u.nombre}</strong>
                <p style={styles.email}>{u.email}</p>
                <span style={styles.badge(u.rol)}>{u.rol}</span>
              </div>

              <button
                style={styles.btnDelete}
                onClick={() => handleEliminar(u.id_usuarios)}
              >
                🗑
              </button>
            </div>
          ))
        )}
      </div>

      <button style={styles.btnVolver} onClick={volver}>
        ⬅ Volver
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "900px",
    margin: "auto",
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  card: {
    background: "#1f2937",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },

  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #374151",
    background: "#111827",
    color: "white",
    flex: "1",
    minWidth: "150px",
  },

  btnCrear: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  userCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px",
    borderBottom: "1px solid #374151",
  },

  email: {
    margin: 0,
    fontSize: "12px",
    color: "#9ca3af",
  },

  badge: (rol) => ({
    background:
      rol === "admin"
        ? "#ef4444"
        : rol === "mecanico"
        ? "#3b82f6"
        : "#6b7280",
    color: "white",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    marginTop: "5px",
    display: "inline-block",
  }),

  btnDelete: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
  },

  btnVolver: {
    marginTop: "10px",
    background: "#374151",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default UsuariosPanel;