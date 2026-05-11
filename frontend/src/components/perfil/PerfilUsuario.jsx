import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL =
  "https://autogest-gateway.onrender.com";

function PerfilUsuario({ volver }) {

  const navigate = useNavigate();

  // =========================
  // SESIÓN
  // =========================
  const usuario = JSON.parse(
    localStorage.getItem("usuario") || "null"
  );

  const usuarioId =
    usuario?.id ||
    usuario?.id_usuarios;

  const rol = (
    localStorage.getItem("rol") ||
    usuario?.rol ||
    ""
  ).toLowerCase();

  // =========================
  // ESTADOS
  // =========================
  const [perfil, setPerfil] =
    useState(null);

  const [modoEdicion, setModoEdicion] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      telefono: "",
      direccion: "",
      ciudad: "",
      documento: "",
      fecha_nacimiento: "",
    });

  // =========================
  // RUTAS
  // =========================
  const roleRoutes = {
    admin: "/admin",
    cliente: "/cliente",
    mecanico: "/mecanico",
    recepcionista: "/recepcionista",
  };

  const irDashboard = () => {
    navigate(
      roleRoutes[rol] || "/"
    );
  };

  // =========================
  // CARGAR PERFIL
  // =========================
  useEffect(() => {

    const cargarPerfil =
      async () => {

      if (!usuarioId) {
        navigate("/login");
        return;
      }

      try {

        const res =
          await fetch(
            `${API_URL}/perfil/${usuarioId}`
          );

        // No existe perfil
        if (res.status === 404) {
          setPerfil(null);
          return;
        }

        if (!res.ok) {
          return;
        }

        const data =
          await res.json();

        // 🔥 AQUÍ ESTABA EL ERROR
        // No validar data.id
        // Solo validar que exista data
        if (data) {

          setPerfil(data);

          setForm({
            telefono:
              data.telefono || "",
            direccion:
              data.direccion || "",
            ciudad:
              data.ciudad || "",
            documento:
              data.documento || "",
            fecha_nacimiento:
              data.fecha_nacimiento || "",
          });
        }

      } catch (error) {

        console.error(
          "Error cargando perfil:",
          error
        );

      } finally {

        setLoading(false);
      }
    };

    cargarPerfil();

  }, [usuarioId, navigate]);

  // =========================
  // VALIDAR FORM
  // =========================
  const validarFormulario =
    () => {

    if (
      !form.telefono ||
      !form.direccion ||
      !form.ciudad ||
      !form.documento
    ) {

      setError(
        "Todos los campos son obligatorios"
      );

      return false;
    }

    return true;
  };

  // =========================
  // GUARDAR
  // =========================
  const guardarPerfil =
    async () => {

    setError("");

    if (
      !validarFormulario()
    ) {
      return;
    }

    setGuardando(true);

    try {

      const metodo =
        perfil ? "PUT" : "POST";

      const res =
        await fetch(
          `${API_URL}/perfil/${usuarioId}`,
          {
            method: metodo,

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(form),
          }
        );

      if (!res.ok) {

        setError(
          "No se pudo guardar el perfil"
        );

        return;
      }

      const data =
        await res.json();

      setPerfil(data);

      setModoEdicion(false);

      // Ir al dashboard
      irDashboard();

    } catch (error) {

      console.error(error);

      setError(
        "Error de conexión"
      );

    } finally {

      setGuardando(false);
    }
  };

  // =========================
  // VOLVER
  // =========================
  const handleVolver =
    () => {

    if (volver) {
      volver();
    } else {
      irDashboard();
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const cerrarSesion =
    () => {

    localStorage.clear();

    navigate("/login");
  };

  if (loading) {

    return (
      <p style={{ color: "white" }}>
        Cargando perfil...
      </p>
    );
  }

  return (

    <div style={styles.container}>

      <div style={styles.topBar}>

        <button
          style={styles.backBtn}
          onClick={handleVolver}
        >
          ⬅ Volver
        </button>

        {!volver && (

          <button
            style={styles.logoutBtn}
            onClick={cerrarSesion}
          >
            🚪 Salir
          </button>

        )}

      </div>

      <h2 style={styles.title}>
        👤 Mi Perfil
      </h2>

      {error && (

        <p style={styles.error}>
          {error}
        </p>

      )}

      {/* VER PERFIL */}
      {!modoEdicion &&
        perfil && (

        <div style={styles.card}>

          <p>
            <strong>📞 Teléfono:</strong>{" "}
            {perfil.telefono}
          </p>

          <p>
            <strong>🏠 Dirección:</strong>{" "}
            {perfil.direccion}
          </p>

          <p>
            <strong>🌆 Ciudad:</strong>{" "}
            {perfil.ciudad}
          </p>

          <p>
            <strong>🪪 Documento:</strong>{" "}
            {perfil.documento}
          </p>

          <button
            style={styles.edit}
            onClick={() =>
              setModoEdicion(true)
            }
          >
            ✏️ Editar Perfil
          </button>

        </div>
      )}

      {/* FORMULARIO */}
      {(modoEdicion ||
        !perfil) && (

        <div style={styles.card}>

          {Object.keys(form).map((campo) => (

            <input
              key={campo}
              type={
                campo ===
                "fecha_nacimiento"
                  ? "date"
                  : "text"
              }
              placeholder={campo}
              value={form[campo]}
              onChange={(e) =>
                setForm({
                  ...form,
                  [campo]:
                    e.target.value,
                })
              }
              style={styles.input}
            />

          ))}

          <button
            onClick={guardarPerfil}
            style={styles.save}
            disabled={guardando}
          >
            {guardando
              ? "Guardando..."
              : "💾 Guardar"}
          </button>

        </div>
      )}

    </div>
  );
}

const styles = {
  container: {
    maxWidth: "500px",
    margin: "auto",
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  error: {
    color: "#ef4444",
    marginBottom: "10px",
  },

  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "20px",
  },

  backBtn: {
    padding: "10px",
    cursor: "pointer",
  },

  logoutBtn: {
    padding: "10px",
    cursor: "pointer",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom: "10px",
  },

  save: {
    width: "100%",
    padding: "12px",
    cursor: "pointer",
  },

  edit: {
    width: "100%",
    padding: "12px",
    marginTop: "10px",
    cursor: "pointer",
  },
};

export default PerfilUsuario;