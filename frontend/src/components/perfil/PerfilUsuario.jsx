import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = "https://autogest-gateway.onrender.com";

function PerfilUsuario({ volver }) {
  const navigate = useNavigate();

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

  const [perfil, setPerfil] = useState(null);
  const [modoEdicion, setModoEdicion] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [guardando, setGuardando] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] = useState({
    telefono: "",
    direccion: "",
    ciudad: "",
    documento: "",
    fecha_nacimiento: "",
  });

  // =========================
  // RUTAS POR ROL
  // =========================
  const roleRoutes = {
    admin: "/admin",
    cliente: "/cliente",
    mecanico: "/mecanico",
    recepcionista: "/recepcionista",
  };

  const irDashboard = () => {
    const ruta = roleRoutes[rol] || "/";
    navigate(ruta);
  };

  // =========================
  // CARGAR PERFIL
  // =========================
  useEffect(() => {
    const cargarPerfil = async () => {
      if (!usuarioId) {
        navigate("/login");
        return;
      }

      try {
        const res = await fetch(
          `${API_URL}/perfil/${usuarioId}`
        );

        if (!res.ok) {
          setLoading(false);
          return;
        }

        const contentType =
          res.headers.get("content-type");

        if (
          !contentType?.includes(
            "application/json"
          )
        ) {
          setLoading(false);
          return;
        }

        const data = await res.json();

        // Si existe perfil
        if (data && data.id) {
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

      } catch (err) {
        console.error(
          "Error cargando perfil:",
          err
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
  const validarFormulario = () => {
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
  // GUARDAR PERFIL
  // =========================
  const guardarPerfil = async () => {
    setError("");

    if (!validarFormulario()) {
      return;
    }

    setGuardando(true);

    try {
      const metodo =
        perfil ? "PUT" : "POST";

      const res = await fetch(
        `${API_URL}/perfil/${usuarioId}`,
        {
          method: metodo,
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            form
          ),
        }
      );

      if (!res.ok) {
        setError(
          "No se pudo guardar el perfil"
        );
        return;
      }

      const contentType =
        res.headers.get(
          "content-type"
        );

      let data = form;

      if (
        contentType?.includes(
          "application/json"
        )
      ) {
        data = await res.json();
      }

      setPerfil(data);
      setModoEdicion(false);

      // Redirigir al dashboard correcto
      irDashboard();

    } catch (err) {
      console.error(
        "Error guardando:",
        err
      );

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
  const handleVolver = () => {
    if (volver) {
      volver();
      return;
    }

    irDashboard();
  };

  // =========================
  // LOGOUT
  // =========================
  const cerrarSesion = () => {
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

      {!modoEdicion &&
        perfil && (
          <div style={styles.card}>
            <p>
              <strong>
                📞 Teléfono:
              </strong>{" "}
              {perfil.telefono}
            </p>

            <p>
              <strong>
                🏠 Dirección:
              </strong>{" "}
              {perfil.direccion}
            </p>

            <p>
              <strong>
                🌆 Ciudad:
              </strong>{" "}
              {perfil.ciudad}
            </p>

            <p>
              <strong>
                🪪 Documento:
              </strong>{" "}
              {perfil.documento}
            </p>

            <p>
              <strong>
                🎂 Nacimiento:
              </strong>{" "}
              {
                perfil.fecha_nacimiento
              }
            </p>

            <button
              style={
                styles.edit
              }
              onClick={() =>
                setModoEdicion(
                  true
                )
              }
            >
              ✏️ Editar Perfil
            </button>
          </div>
        )}

      {(modoEdicion ||
        !perfil) && (
        <div style={styles.card}>

          <input
            placeholder="Teléfono"
            value={
              form.telefono
            }
            onChange={(
              e
            ) =>
              setForm({
                ...form,
                telefono:
                  e.target
                    .value,
              })
            }
            style={
              styles.input
            }
          />

          <input
            placeholder="Dirección"
            value={
              form.direccion
            }
            onChange={(
              e
            ) =>
              setForm({
                ...form,
                direccion:
                  e.target
                    .value,
              })
            }
            style={
              styles.input
            }
          />

          <input
            placeholder="Ciudad"
            value={
              form.ciudad
            }
            onChange={(
              e
            ) =>
              setForm({
                ...form,
                ciudad:
                  e.target
                    .value,
              })
            }
            style={
              styles.input
            }
          />

          <input
            placeholder="Documento"
            value={
              form.documento
            }
            onChange={(
              e
            ) =>
              setForm({
                ...form,
                documento:
                  e.target
                    .value,
              })
            }
            style={
              styles.input
            }
          />

          <input
            type="date"
            value={
              form.fecha_nacimiento
            }
            onChange={(
              e
            ) =>
              setForm({
                ...form,
                fecha_nacimiento:
                  e.target
                    .value,
              })
            }
            style={
              styles.input
            }
          />

          <button
            onClick={
              guardarPerfil
            }
            style={
              styles.save
            }
            disabled={
              guardando
            }
          >
            {guardando
              ? "Guardando..."
              : "💾 Guardar Cambios"}
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
    textAlign: "center",
    marginBottom: "10px",
  },

  topBar: {
    display: "flex",
    justifyContent:
      "space-between",
    marginBottom: "15px",
  },

  backBtn: {
    padding: "10px",
    background:
      "#2563eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },

  logoutBtn: {
    padding: "10px",
    background:
      "#ef4444",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },

  card: {
    background:
      "#1e293b",
    padding: "20px",
    borderRadius: "12px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginBottom:
      "10px",
    borderRadius:
      "8px",
    border:
      "1px solid #334155",
    background:
      "#0f172a",
    color: "white",
    boxSizing:
      "border-box",
  },

  save: {
    width: "100%",
    padding: "12px",
    background:
      "#10b981",
    border: "none",
    borderRadius:
      "8px",
    color: "white",
    fontWeight:
      "bold",
    cursor: "pointer",
  },

  edit: {
    marginTop: "15px",
    padding: "12px",
    background:
      "#2563eb",
    border: "none",
    borderRadius:
      "8px",
    color: "white",
    width: "100%",
    cursor: "pointer",
  },
};

export default PerfilUsuario;