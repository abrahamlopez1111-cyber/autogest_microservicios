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

  if (loading) return <p>Cargando perfil...</p>;

  return (
    <div style={styles.container}>
      <button onClick={volver} style={styles.back}>  
      ⬅ Volver 
      </button>

      <h2>👤 Mi Perfil</h2>

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
            ✏️ Editar
          </button>
        </div>
      )}

      {/* ========================= */}
      {/* ✏️ MODO EDICIÓN */}
      {/* ========================= */}
      {(modoEdicion || !perfil) && (
        <>
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
            💾 Guardar
          </button>
        </>
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

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "10px",
    marginBottom: "15px",
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
  },

  edit: {
    marginTop: "10px",
    padding: "10px",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    width: "100%",
  },

  back: {
    marginBottom: "10px",
    padding: "8px",
    background: "#2563eb",
    border: "none",
    borderRadius: "6px",
    color: "white",
  },
};

export default PerfilUsuario;