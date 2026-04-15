import { useEffect, useState } from "react";

function PerfilUsuario({ volver }) {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const usuarioId = usuario?.id || usuario?.id_usuarios;

  const [perfil, setPerfil] = useState(null);
  const [modoEdicion, setModoEdicion] = useState(false);

  const [form, setForm] = useState({
    telefono: "",
    direccion: "",
    ciudad: "",
    documento: "",
    fecha_nacimiento: "",
  });

  const [loading, setLoading] = useState(true);

  // =========================
  // 🔥 CARGAR PERFIL
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
  // 💾 GUARDAR PERFIL
  // =========================
  const guardarPerfil = async () => {
    try {
      const url = `http://localhost:8002/perfil/${usuarioId}`;

      const res = await fetch(url, {
        method: perfil ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();
        setPerfil(data);
        setModoEdicion(false);
        alert("Perfil guardado ✅");
      } else {
        alert("Error guardando perfil ❌");
      }

    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // 🔐 LOGOUT
  // =========================
  const cerrarSesion = () => {
    localStorage.removeItem("usuario");
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (loading) return <p style={{ color: "white" }}>Cargando perfil...</p>;

  return (
    <div style={styles.container}>

      {/* 🔝 BOTONES SUPERIORES */}
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={volver}>
          ⬅ Volver
        </button>

        <button style={styles.logoutBtn} onClick={cerrarSesion}>
          🚪 Salir
        </button>
      </div>

      <h2 style={styles.title}>👤 Mi Perfil</h2>

      {/* ========================= */}
      {/* 🔍 MODO VISUAL */}
      {/* ========================= */}
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

      {/* ========================= */}
      {/* ✏️ MODO EDICIÓN */}
      {/* ========================= */}
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

// =========================
// 🎨 ESTILOS MEJORADOS
// =========================
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
    marginBottom: "15px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
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