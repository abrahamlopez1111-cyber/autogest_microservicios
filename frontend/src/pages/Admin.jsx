import { useState, useEffect } from "react";
import {
  crearUsuario,
  getUsuarios,
  eliminarUsuario,
} from "../services/usuariosApi";

function Admin() {
  const [vista, setVista] = useState("menu");
  const [usuarios, setUsuarios] = useState([]);

  const [nuevo, setNuevo] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "cliente",
  });

  // 🔥 CARGAR USUARIOS
  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();

      // 🔥 PROTECCIÓN
      if (Array.isArray(data)) {
        setUsuarios(data);
      } else {
        setUsuarios([]);
        console.error("La API no devolvió un array:", data);
      }
    } catch (error) {
      console.error("Error cargando usuarios:", error);
      setUsuarios([]);
    }
  };

  useEffect(() => {
    if (vista === "usuarios") {
      cargarUsuarios();
    }
  }, [vista]);

  // 🔥 CREAR
  const handleCrear = async () => {
    try {
      await crearUsuario(nuevo);

      setNuevo({
        nombre: "",
        email: "",
        password: "",
        rol: "cliente",
      });

      cargarUsuarios();
    } catch (error) {
      alert("Error al crear usuario");
    }
  };

  // 🔥 ELIMINAR
  const handleEliminar = async (id_usuarios) => {
    try {
      await eliminarUsuario(id_usuarios);
      cargarUsuarios();
    } catch (error) {
      alert("Error al eliminar usuario");
    }
  };

  return (
    <div style={styles.container}>
      <h1>👑 Panel Administrador</h1>

      {/* 🔥 MENÚ */}
      {vista === "menu" && (
        <div style={styles.menu}>
          <button onClick={() => setVista("usuarios")} style={styles.card}>
            👤 Usuarios
          </button>

          <button onClick={() => setVista("sucursales")} style={styles.card}>
            🏢 Sucursales
          </button>

          <button onClick={() => setVista("mecanicos")} style={styles.card}>
            🔧 Mecánicos
          </button>
        </div>
      )}

      {/* 👤 USUARIOS */}
      {vista === "usuarios" && (
        <div style={styles.panel}>
          <h2>👤 Gestión de Usuarios</h2>

          {/* 🔥 FORMULARIO */}
          <div style={styles.form}>
            <input
              placeholder="Nombre"
              value={nuevo.nombre}
              onChange={(e) =>
                setNuevo({ ...nuevo, nombre: e.target.value })
              }
            />

            <input
              placeholder="Email"
              value={nuevo.email}
              onChange={(e) =>
                setNuevo({ ...nuevo, email: e.target.value })
              }
            />

            <input
              placeholder="Password"
              value={nuevo.password}
              onChange={(e) =>
                setNuevo({ ...nuevo, password: e.target.value })
              }
            />

            <select
              value={nuevo.rol}
              onChange={(e) =>
                setNuevo({ ...nuevo, rol: e.target.value })
              }
            >
              <option value="cliente">Cliente</option>
              <option value="mecanico">Mecánico</option>
              <option value="admin">Administrador</option>
            </select>

            <button onClick={handleCrear} style={styles.create}>
              ➕ Crear
            </button>
          </div>

          {/* 🔥 TABLA */}
          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>

            <tbody>
              {Array.isArray(usuarios) && usuarios.length > 0 ? (
                usuarios.map((u) => (
                  <tr key={u.id_usuarios}>
                    <td>{u.id_usuarios}</td>
                    <td>{u.nombre}</td>
                    <td>{u.email}</td>
                    <td>{u.rol}</td>
                    <td>
                      <button style={styles.edit}>✏️</button>

                      <button
                        style={styles.delete}
                        onClick={() => handleEliminar(u.id_usuarios)}
                      >
                        🗑
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">No hay usuarios</td>
                </tr>
              )}
            </tbody>
          </table>

          <br />
          <button onClick={() => setVista("menu")}>⬅ Volver</button>
        </div>
      )}

      {/* 🏢 SUCURSALES */}
      {vista === "sucursales" && (
        <div style={styles.panel}>
          <h2>🏢 Gestión de Sucursales</h2>
          <p>🚧 Próximamente...</p>
          <button onClick={() => setVista("menu")}>⬅ Volver</button>
        </div>
      )}

      {/* 🔧 MECÁNICOS */}
      {vista === "mecanicos" && (
        <div style={styles.panel}>
          <h2>🔧 Gestión de Mecánicos</h2>
          <p>🚧 Próximamente...</p>
          <button onClick={() => setVista("menu")}>⬅ Volver</button>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    textAlign: "center",
  },

  menu: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
  },

  card: {
    padding: "20px",
    fontSize: "16px",
    cursor: "pointer",
    borderRadius: "10px",
    border: "none",
    background: "#1e3a8a",
    color: "white",
    width: "200px",
  },

  panel: {
    marginTop: "20px",
  },

  form: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  create: {
    background: "#10b981",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },

  edit: {
    marginRight: "5px",
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },

  delete: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
  },
};

export default Admin;