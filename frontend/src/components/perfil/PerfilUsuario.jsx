import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PerfilUsuario({ volver }) {
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const usuarioId = usuario?.id || usuario?.id_usuarios;
  const rol = localStorage.getItem("rol");

  const [perfil, setPerfil] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    telefono: "",
    direccion: "",
    ciudad: "",
    documento: "",
    fecha_nacimiento: "",
  });

  // 🔥 RUTAS POR ROL
  const roleRoutes = {
    admin: "/admin",
    cliente: "/cliente",
    mecanico: "/mecanico",
    recepcionista: "/recepcion",
  };

  // =========================
  // 🔍 CARGAR PERFIL
  // =========================
  useEffect(() => {
    const cargarPerfil = async () => {
      try {
        const res = await fetch(
          `http://localhost:8002/perfil/${usuarioId}`
        );

        if (res.ok) {
          const data = await res.json();
          setPerfil(data);
          setForm(data);
        }

      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (usuarioId) cargarPerfil();
  }, [usuarioId]);

  // =========================
  // 💾 GUARDAR
  // =========================
  const guardarPerfil = async () => {
    try {
      const res = await fetch(
        `http://localhost:8002/perfil/${usuarioId}`,
        {
          method: perfil ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      if (res.ok) {
        const data = await res.json();
        setPerfil(data);
        setModoEdicion(false);

        // 🔥 REDIRECCIÓN AUTOMÁTICA
        const ruta = roleRoutes[rol] || "/";
        navigate(ruta);

      } else {
        alert("Error guardando perfil ❌");
      }

    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // 🔙 VOLVER (SIEMPRE FUNCIONA)
  // =========================
  const handleVolver = () => {
    if (volver) {
      volver();
    } else {
      const ruta = roleRoutes[rol] || "/";
      navigate(ruta);
    }
  };

  // =========================
  // 🔐 LOGOUT
  // =========================
  const cerrarSesion = () => {
    localStorage.clear();
    navigate("/login");
  };

  if (loading) return <p style={{ color: "white" }}>Cargando perfil...</p>;

  return (
    <div style={styles.container}>

      {/* 🔝 BOTONES */}
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={handleVolver}>
          ⬅ Volver
        </button>

        {/* 🔥 SOLO mostrar logout si NO viene del guard */}
        {!volver && (
          <button style={styles.logoutBtn} onClick={cerrarSesion}>
            🚪 Salir
          </button>
        )}
      </div>

      <h2 style={styles.title}>👤 Mi Perfil</h2>

      {!modoEdicion && perfil && (
        <div style={styles.card}>
          <p><strong>📞 Teléfono:</strong> {perfil.telefono}</p>
          <p><strong>🏠 Dirección:</strong> {perfil.direccion}</p>
          <p><strong>🌆 Ciudad:</strong> {perfil.ciudad}</p>
          <p><strong>🪪 Documento:</strong> {perfil.documento}</p>
          <p><strong>🎂 Nacimiento:</strong> {perfil.fecha_nacimiento}</p>

          <button
            style={styles.edit}
            onClick={() => setModoEdicion(true)}
          >
            ✏️ Editar Perfil
          </button>
        </div>
      )}

      {(modoEdicion || !perfil) && (
        <div style={styles.card}>
          <input
            placeholder="Teléfono"
            value={form.telefono || ""}
            onChange={(e) =>
              setForm({ ...form, telefono: e.target.value })
            }
            style={styles.input}
          />

          <input
            placeholder="Dirección"
            value={form.direccion || ""}
            onChange={(e) =>
              setForm({ ...form, direccion: e.target.value })
            }
            style={styles.input}
          />

          <input
            placeholder="Ciudad"
            value={form.ciudad || ""}
            onChange={(e) =>
              setForm({ ...form, ciudad: e.target.value })
            }
            style={styles.input}
          />

          <input
            placeholder="Documento"
            value={form.documento || ""}
            onChange={(e) =>
              setForm({ ...form, documento: e.target.value })
            }
            style={styles.input}
          />

          <input
            type="date"
            value={form.fecha_nacimiento || ""}
            onChange={(e) =>
              setForm({
                ...form,
                fecha_nacimiento: e.target.value,
              })
            }
            style={styles.input}
          />

          <button onClick={guardarPerfil} style={styles.save}>
            💾 Guardar Cambios
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
  topBar: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "15px",
  },
  backBtn: {
    padding: "10px",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
  logoutBtn: {
    padding: "10px",
    background: "#ef4444",
    border: "none",
    borderRadius: "8px",
    color: "white",
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
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
  },
  save: {
    width: "100%",
    padding: "12px",
    background: "#10b981",
    border: "none",
    borderRadius: "8px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
  edit: {
    marginTop: "15px",
    padding: "12px",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    width: "100%",
    cursor: "pointer",
  },
};

export default PerfilUsuario;