import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GATEWAY = "https://autogest-gateway.onrender.com";

function CitasHoyRecepcionista() {
  const navigate = useNavigate();

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [filtro, setFiltro] = useState("todas"); // "todas" | "hoy"
  const [form, setForm] = useState({ cita_id: null, kilometraje: "", observaciones: "" });
  const [msg, setMsg] = useState({ texto: "", tipo: "" });

  const mostrar = (texto, tipo = "success") => {
    setMsg({ texto, tipo });
    setTimeout(() => setMsg({ texto: "", tipo: "" }), 3000);
  };

  const cargarDatos = async () => {
    try {
      setLoading(true);

      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario) return;

      // Obtener recepcionista y su sucursal
      const resRecep = await fetch(`${GATEWAY}/recepcionistas`);
      const recepcionistas = await resRecep.json();
      const recepcionista = recepcionistas.find(
        (r) => r.usuario_id === usuario.id_usuarios
      );

      if (!recepcionista) {
        mostrar("No se encontró tu perfil de recepcionista", "error");
        return;
      }

      // Traer TODAS las citas de la sucursal (no solo hoy)
      const resCitas = await fetch(
        `${GATEWAY}/citas/sucursal/${recepcionista.sucursal_id}`
      );
      const citasData = await resCitas.json();

      // Datos extra
      const [resUsuarios, resVehiculos] = await Promise.all([
        fetch(`${GATEWAY}/usuarios`),
        fetch(`${GATEWAY}/historial/vehiculos`),
      ]);

      setUsuarios(await resUsuarios.json());
      setVehiculos(await resVehiculos.json());
      setCitas(Array.isArray(citasData) ? citasData : []);

    } catch (error) {
      console.error(error);
      mostrar("Error cargando citas", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { cargarDatos(); }, []);

  const recibir = async () => {
    if (!form.kilometraje) {
      mostrar("Ingrese el kilometraje", "error");
      return;
    }
    try {
      const res = await fetch(`${GATEWAY}/citas/${form.cita_id}/recibir`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kilometraje: Number(form.kilometraje),
          observaciones: form.observaciones,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        mostrar("Error: " + (data.detail || "No se pudo recibir"), "error");
        return;
      }

      mostrar("Vehículo recibido correctamente ✅");
      setForm({ cita_id: null, kilometraje: "", observaciones: "" });
      setTimeout(() => cargarDatos(), 800);
    } catch {
      mostrar("Error de conexión", "error");
    }
  };

  const getNombre = (id) =>
    usuarios.find((u) => u.id_usuarios === id)?.nombre || "N/A";

  const getPlaca = (id) =>
    vehiculos.find((v) => v.id === id)?.placa || "N/A";

  const esHoy = (fecha) => {
    const hoy = new Date().toDateString();
    return new Date(fecha).toDateString() === hoy;
  };

  const colorEstado = (estado) => ({
    programada: "#2563eb",
    recibida: "#d97706",
    en_proceso: "#7c3aed",
    finalizada: "#16a34a",
    cancelada: "#dc2626",
  }[estado] || "#475569");

  // Filtrar citas según selección
  const citasFiltradas = citas.filter((c) => {
    if (filtro === "hoy") return esHoy(c.fecha_hora_inicio);
    return true;
  });

  return (
    <div style={styles.container}>

      {msg.texto && (
        <div style={{ ...styles.toast, background: msg.tipo === "error" ? "#dc2626" : "#16a34a" }}>
          {msg.texto}
        </div>
      )}

      <button style={styles.btnVolver} onClick={() => navigate("/recepcionista")}>
        ⬅ Volver
      </button>

      <h2 style={styles.title}>📅 Citas de la Sucursal</h2>

      {/* FILTROS */}
      <div style={styles.filtros}>
        {["todas", "hoy"].map((f) => (
          <button
            key={f}
            style={{ ...styles.filtroBtn, background: filtro === f ? "#2563eb" : "#1e293b" }}
            onClick={() => setFiltro(f)}
          >
            {f === "todas" ? "Todas" : "Hoy"}
          </button>
        ))}
      </div>

      {loading ? (
        <p style={styles.estado}>Cargando...</p>
      ) : citasFiltradas.length === 0 ? (
        <p style={styles.estado}>No hay citas {filtro === "hoy" ? "para hoy" : ""}</p>
      ) : (
        citasFiltradas.map((c) => (
          <div key={c.id} style={styles.card}>
            <div style={styles.cardHeader}>
              <div>
                <strong>{getNombre(c.usuario_id)}</strong>
                <p style={styles.sub}>🚗 {getPlaca(c.vehiculo_id)}</p>
              </div>
              <div style={styles.rightInfo}>
                <span style={{ ...styles.badge, background: colorEstado(c.estado) }}>
                  {c.estado}
                </span>
                <p style={styles.fecha}>
                  {new Date(c.fecha_hora_inicio).toLocaleDateString("es-CO", {
                    timeZone: "America/Bogota",
                    day: "2-digit", month: "short", year: "numeric",
                  })}
                  {" — "}
                  {new Date(c.fecha_hora_inicio).toLocaleTimeString("es-CO", {
                    timeZone: "America/Bogota",
                    hour: "2-digit", minute: "2-digit",
                  })}
                </p>
              </div>
            </div>

            {c.observacion_cliente && (
              <p style={styles.obs}>💬 {c.observacion_cliente}</p>
            )}

            {filtro === "hoy" && c.estado === "programada" && (
              <>
                {form.cita_id === c.id ? (
                  <div style={styles.formRecibir}>
                    <input
                      style={styles.input}
                      type="number"
                      placeholder="Kilometraje actual *"
                      value={form.kilometraje}
                      onChange={(e) => setForm({ ...form, kilometraje: e.target.value })}
                    />
                    <textarea
                      style={styles.textarea}
                      placeholder="Observaciones al recibir (opcional)"
                      value={form.observaciones}
                      onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                    />
                    <div style={styles.formBotones}>
                      <button style={styles.btnConfirmar} onClick={recibir}>
                        ✅ Confirmar recepción
                      </button>
                      <button style={styles.btnCancelar}
                        onClick={() => setForm({ cita_id: null, kilometraje: "", observaciones: "" })}>
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <button style={styles.btnRecibir}
                    onClick={() => setForm({ ...form, cita_id: c.id })}>
                    🚗 Recibir vehículo
                  </button>
                )}
              </>
            )}

          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "750px", margin: "0 auto", padding: "24px", color: "white", minHeight: "100vh", background: "#0f172a" },
  title: { textAlign: "center", marginBottom: "20px" },
  btnVolver: { background: "#374151", border: "none", color: "white", padding: "10px 16px", borderRadius: "8px", cursor: "pointer", marginBottom: "16px" },
  filtros: { display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" },
  filtroBtn: { border: "none", color: "white", padding: "8px 18px", borderRadius: "20px", cursor: "pointer", fontSize: "13px", fontWeight: "500" },
  estado: { textAlign: "center", color: "#94a3b8", marginTop: "40px" },
  card: { background: "#1e293b", padding: "16px 20px", marginBottom: "14px", borderRadius: "12px" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" },
  sub: { margin: "4px 0 0", color: "#94a3b8", fontSize: "13px" },
  rightInfo: { textAlign: "right" },
  badge: { fontSize: "12px", padding: "3px 10px", borderRadius: "20px", color: "white", fontWeight: "500" },
  fecha: { fontSize: "12px", color: "#94a3b8", margin: "4px 0 0" },
  obs: { margin: "10px 0 0", fontSize: "13px", color: "#cbd5e1", fontStyle: "italic" },
  formRecibir: { marginTop: "14px", display: "flex", flexDirection: "column", gap: "8px" },
  input: { padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "white", fontSize: "14px" },
  textarea: { padding: "10px", borderRadius: "8px", border: "1px solid #334155", background: "#0f172a", color: "white", fontSize: "14px", minHeight: "70px", resize: "vertical" },
  formBotones: { display: "flex", gap: "8px" },
  btnConfirmar: { flex: 2, padding: "10px", background: "#16a34a", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontWeight: "bold" },
  btnCancelar: { flex: 1, padding: "10px", background: "#334155", border: "none", borderRadius: "8px", color: "white", cursor: "pointer" },
  btnRecibir: { marginTop: "12px", padding: "9px 16px", background: "#2563eb", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "14px" },
  toast: { position: "fixed", top: "20px", right: "20px", padding: "12px 20px", color: "white", borderRadius: "10px", fontWeight: "bold", zIndex: 9999, boxShadow: "0 5px 15px rgba(0,0,0,0.3)", maxWidth: "350px" },
};

export default CitasHoyRecepcionista;