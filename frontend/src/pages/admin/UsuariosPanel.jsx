import { useState, useEffect } from "react";
import {
  crearUsuario,
  getUsuarios,
  eliminarUsuario,
} from "../../services/usuariosApi";

function UsuariosPanel({ volver }) {
  const [usuarios, setUsuarios] = useState([]);

  const [nuevo, setNuevo] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "cliente",
  });

  const [loading, setLoading] =
    useState(false);

  // =========================
  // CARGAR USUARIOS
  // =========================
  const cargarUsuarios = async () => {
    try {
      const data = await getUsuarios();

      setUsuarios(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {
      console.error(
        "Error cargando usuarios:",
        error
      );
    }
  };

  useEffect(() => {
    cargarUsuarios();
  }, []);

  // =========================
  // CREAR USUARIO
  // =========================
  const handleCrear = async () => {

    if (
      !nuevo.nombre ||
      !nuevo.email ||
      !nuevo.password
    ) {
      alert(
        "Completa todos los campos"
      );
      return;
    }

    try {
      setLoading(true);

      await crearUsuario(
        nuevo
      );

      setNuevo({
        nombre: "",
        email: "",
        password: "",
        rol: "cliente",
      });

      await cargarUsuarios();

    } catch (error) {
      console.error(
        "Error creando usuario:",
        error
      );

      alert(
        "No se pudo crear el usuario"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ELIMINAR
  // =========================
  const handleEliminar = async (
    id
  ) => {

    if (
      !window.confirm(
        "¿Eliminar usuario?"
      )
    ) {
      return;
    }

    try {
      await eliminarUsuario(id);
      await cargarUsuarios();

    } catch (error) {
      console.error(
        "Error eliminando:",
        error
      );
    }
  };

  return (
    <div style={styles.container}>

      <h2 style={styles.title}>
        👤 Gestión de Usuarios
      </h2>

      {/* FORM */}
      <div style={styles.card}>

        <h3 style={styles.subtitle}>
          Crear Usuario
        </h3>

        <div style={styles.form}>

          <input
            style={styles.input}
            placeholder="Nombre"
            value={nuevo.nombre}
            onChange={(e) =>
              setNuevo({
                ...nuevo,
                nombre:
                  e.target.value,
              })
            }
          />

          <input
            style={styles.input}
            placeholder="Correo"
            value={nuevo.email}
            onChange={(e) =>
              setNuevo({
                ...nuevo,
                email:
                  e.target.value,
              })
            }
          />

          <input
            style={styles.input}
            type="password"
            placeholder="Contraseña"
            value={nuevo.password}
            onChange={(e) =>
              setNuevo({
                ...nuevo,
                password:
                  e.target.value,
              })
            }
          />

          <select
            style={styles.input}
            value={nuevo.rol}
            onChange={(e) =>
              setNuevo({
                ...nuevo,
                rol:
                  e.target.value,
              })
            }
          >
            <option value="cliente">
              Cliente
            </option>

            <option value="mecanico">
              Mecánico
            </option>

            <option value="admin">
              Administrador
            </option>

            <option value="recepcionista">
              Recepcionista
            </option>

          </select>

          <button
            style={styles.btnCrear}
            onClick={
              handleCrear
            }
            disabled={
              loading
            }
          >
            {loading
              ? "Creando..."
              : "➕ Crear Usuario"}
          </button>

        </div>
      </div>

      {/* LISTA */}
      <div style={styles.card}>

        <h3 style={styles.subtitle}>
          Usuarios Registrados
        </h3>

        {usuarios.length ===
        0 ? (

          <p
            style={
              styles.empty
            }
          >
            No hay usuarios
          </p>

        ) : (

          usuarios.map(
            (u) => (

              <div
                key={
                  u.id_usuarios
                }
                style={
                  styles.userCard
                }
              >

                <div
                  style={
                    styles.userInfo
                  }
                >

                  <strong>
                    {u.nombre}
                  </strong>

                  <p
                    style={
                      styles.email
                    }
                  >
                    {u.email}
                  </p>

                  <span
                    style={styles.badge(
                      u.rol
                    )}
                  >
                    {u.rol}
                  </span>

                </div>

                <button
                  style={
                    styles.btnDelete
                  }
                  onClick={() =>
                    handleEliminar(
                      u.id_usuarios
                    )
                  }
                >
                  🗑
                </button>

              </div>
            )
          )
        )}
      </div>

      <button
        style={
          styles.btnVolver
        }
        onClick={volver}
      >
        ⬅ Volver
      </button>

    </div>
  );
}

const styles = {

  container: {
    width: "100%",
    maxWidth: "1000px",
    margin: "auto",
    padding: "15px",
    color: "white",
    boxSizing:
      "border-box",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "clamp(22px, 4vw, 32px)",
  },

  subtitle: {
    marginBottom: "15px",
    fontSize: "18px",
  },

  card: {
    background:
      "#1f2937",
    padding: "20px",
    borderRadius:
      "16px",
    marginBottom:
      "20px",
    boxShadow:
      "0 4px 14px rgba(0,0,0,0.35)",
  },

  form: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius:
      "10px",
    border:
      "1px solid #374151",
    background:
      "#111827",
    color: "white",
    fontSize: "14px",
    boxSizing:
      "border-box",
  },

  btnCrear: {
    background:
      "#2563eb",
    color: "white",
    border: "none",
    padding: "12px",
    borderRadius:
      "10px",
    cursor: "pointer",
    fontWeight: "bold",
    minHeight: "46px",
  },

  userCard: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    padding: "15px 0",
    borderBottom:
      "1px solid #374151",
  },

  userInfo: {
    flex: 1,
    minWidth: "180px",
  },

  email: {
    margin: "5px 0",
    color: "#9ca3af",
    fontSize: "13px",
    wordBreak:
      "break-word",
  },

  empty: {
    color: "#9ca3af",
  },

  badge: (rol) => ({
    background:
      rol === "admin"
        ? "#ef4444"
        : rol ===
          "mecanico"
        ? "#2563eb"
        : rol ===
          "recepcionista"
        ? "#8b5cf6"
        : "#10b981",

    color: "white",

    padding:
      "5px 10px",

    borderRadius:
      "8px",

    fontSize: "12px",

    display:
      "inline-block",
  }),

  btnDelete: {
    background:
      "#ef4444",
    color: "white",
    border: "none",
    padding:
      "10px 14px",
    borderRadius:
      "8px",
    cursor: "pointer",
    minWidth: "50px",
  },

  btnVolver: {
    width: "100%",
    background:
      "#374151",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius:
      "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default UsuariosPanel;