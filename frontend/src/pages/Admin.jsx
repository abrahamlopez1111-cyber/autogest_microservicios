import { useState, useEffect } from "react";
import {
  crearUsuario,
  getUsuarios,
  eliminarUsuario,
} from "../services/usuariosApi";

import {
  crearSucursal,
  getSucursales,
} from "../services/citasApi";

function Admin() {
  const [vista, setVista] = useState("menu");

  // =========================
  // 👤 USUARIOS
  // =========================
  const [usuarios, setUsuarios] = useState([]);

  const [nuevo, setNuevo] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "cliente",
  });

  // =========================
  // 🏢 SUCURSALES
  // =========================
  const [sucursales, setSucursales] = useState([]);

  const [nuevaSucursal, setNuevaSucursal] = useState({
    nombre: "",
    pais: "",
    capacidad_elevadores: "",
  });

  // =========================
  // 🔄 CARGAR DATOS
  // =========================

  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setUsuarios([]);
    }
  };

  const cargarSucursales = async () => {
    try {
      const data = await getSucursales();
      setSucursales(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error(error);
      setSucursales([]);
    }
  };

  useEffect(() => {
    if (vista === "usuarios") cargarUsuarios();
    if (vista === "sucursales") cargarSucursales();
  }, [vista]);

  // =========================
  // 👤 USUARIOS
  // =========================

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
    } catch {
      alert("Error al crear usuario");
    }
  };

  const handleEliminar = async (id) => {
    try {
      await eliminarUsuario(id);
      cargarUsuarios();
    } catch {
      alert("Error al eliminar usuario");
    }
  };

  // =========================
  // 🏢 SUCURSALES
  // =========================

  const handleCrearSucursal = async () => {
    try {
      await crearSucursal({
        ...nuevaSucursal,
        capacidad_elevadores: Number(nuevaSucursal.capacidad_elevadores),
      });

      setNuevaSucursal({
        nombre: "",
        pais: "",
        capacidad_elevadores: "",
      });

      cargarSucursales();
    } catch {
      alert("Error al crear sucursal");
    }
  };

  // =========================
  // 🎨 UI
  // =========================

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

      {/* =========================
          👤 USUARIOS
      ========================= */}
      {vista === "usuarios" && (
        <div style={styles.panel}>
          <h2>👤 Gestión de Usuarios</h2>

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
              {usuarios.length > 0 ? (
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

      {/* =========================
          🏢 SUCURSALES
      ========================= */}
      {vista === "sucursales" && (
        <div style={styles.panel}>
          <h2>🏢 Gestión de Sucursales</h2>

          <div style={styles.form}>
            <input
              placeholder="Nombre"
              value={nuevaSucursal.nombre}
              onChange={(e) =>
                setNuevaSucursal({
                  ...nuevaSucursal,
                  nombre: e.target.value,
                })
              }
            />

            <input
              placeholder="País"
              value={nuevaSucursal.pais}
              onChange={(e) =>
                setNuevaSucursal({
                  ...nuevaSucursal,
                  pais: e.target.value,
                })
              }
            />

            <input
              placeholder="Capacidad"
              type="number"
              value={nuevaSucursal.capacidad_elevadores}
              onChange={(e) =>
                setNuevaSucursal({
                  ...nuevaSucursal,
                  capacidad_elevadores: e.target.value,
                })
              }
            />

            <button onClick={handleCrearSucursal} style={styles.create}>
              ➕ Crear
            </button>
          </div>

          <table style={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>País</th>
                <th>Capacidad</th>
              </tr>
            </thead>

            <tbody>
              {sucursales.length > 0 ? (
                sucursales.map((s) => (
                  <tr key={s.id}>
                    <td>{s.id}</td>
                    <td>{s.nombre}</td>
                    <td>{s.pais}</td>
                    <td>{s.capacidad_elevadores}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4">No hay sucursales</td>
                </tr>
              )}
            </tbody>
          </table>

          <br />
          <button onClick={() => setVista("menu")}>⬅ Volver</button>
        </div>
      )}

      {/* =========================
          🔧 MECÁNICOS
      ========================= */}
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
  container: { padding: "30px", textAlign: "center" },

  menu: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
    marginTop: "30px",
  },

  card: {
    padding: "20px",
    borderRadius: "10px",
    border: "none",
    background: "#1e3a8a",
    color: "white",
    cursor: "pointer",
  },

  panel: { marginTop: "20px" },

  form: {
    display: "flex",
    gap: "10px",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: "20px",
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
    background: "#3b82f6",
    color: "white",
    border: "none",
    padding: "5px",
    marginRight: "5px",
  },

  delete: {
    background: "#ef4444",
    color: "white",
    border: "none",
    padding: "5px",
  },
};

export default Admin;