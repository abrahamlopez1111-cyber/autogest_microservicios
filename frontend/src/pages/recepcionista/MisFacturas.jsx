import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GATEWAY = "https://autogest-gateway.onrender.com";

function MisFacturas() {
  const navigate = useNavigate();
  const [facturas, setFacturas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {
    try {
      setLoading(true);
      const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
      if (!usuario) return;

      const resRecep = await fetch(`${GATEWAY}/recepcionistas`);
      const recepcionistas = await resRecep.json();
      const recepcionista = recepcionistas.find(
        (r) => r.usuario_id === usuario.id_usuarios
      );

      if (!recepcionista) {
        setError("No se encontró tu perfil de recepcionista.");
        return;
      }

      const resFacturas = await fetch(`${GATEWAY}/facturas`);
      const todasFacturas = await resFacturas.json();

      const resCitas = await fetch(
        `${GATEWAY}/citas/sucursal/${recepcionista.sucursal_id}`
      );
      const citas = await resCitas.json();
      const idsCitasSucursal = new Set(citas.map((c) => c.id));

      const facturasFiltradas = todasFacturas.filter((f) =>
        idsCitasSucursal.has(f.cita_id)
      );

      setFacturas(facturasFiltradas);
    } catch (err) {
      setError("Error cargando facturas.");
    } finally {
      setLoading(false);
    }
  };

  const descargarFactura = (id) => {
    window.open(`${GATEWAY}/facturas/${id}/pdf`, "_blank");
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "—";
    return new Date(fecha).toLocaleDateString("es-CO", {
      timeZone: "America/Bogota",
      dateStyle: "medium",
    });
  };

  return (
    <div style={styles.container}>
      <button style={styles.btnVolver} onClick={() => navigate("/recepcionista")}>
        ⬅ Volver
      </button>

      <h2 style={styles.title}>💰 Facturas generadas</h2>

      {loading && <p style={styles.msg}>Cargando...</p>}
      {error && <p style={{ ...styles.msg, color: "#ef4444" }}>{error}</p>}

      {!loading && !error && facturas.length === 0 && (
        <p style={styles.msg}>No hay facturas generadas para tu sucursal.</p>
      )}

      {facturas.map((f) => (
        <div key={f.id} style={styles.card}>
          <div style={styles.cardHeader}>
            <span style={styles.numero}>#{f.numero_factura || f.id}</span>
            <span style={styles.total}>${Number(f.total).toLocaleString("es-CO")}</span>
          </div>
          {f.fecha_emision && (
            <p style={styles.info}><strong>Fecha:</strong> {formatearFecha(f.fecha_emision)}</p>
          )}
          {f.cita_id && (
            <p style={styles.info}><strong>Cita #:</strong> {f.cita_id}</p>
          )}
          <button onClick={() => descargarFactura(f.id)} style={styles.btn}>
            ⬇ Descargar PDF
          </button>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: { color: "white", padding: "24px", maxWidth: "700px", margin: "auto", minHeight: "100vh", background: "#0f172a" },
  title: { textAlign: "center", marginBottom: "20px" },
  msg: { textAlign: "center", color: "#94a3b8" },
  btnVolver: { background: "#334155", color: "white", border: "none", padding: "10px 18px", borderRadius: "8px", cursor: "pointer", marginBottom: "20px" },
  card: { background: "#1e293b", padding: "16px 20px", marginBottom: "12px", borderRadius: "12px" },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" },
  numero: { fontWeight: "bold", fontSize: "15px" },
  total: { fontSize: "18px", fontWeight: "bold", color: "#22c55e" },
  info: { margin: "4px 0", fontSize: "13px", color: "#94a3b8" },
  btn: { marginTop: "10px", padding: "8px 16px", background: "#2563eb", border: "none", borderRadius: "8px", color: "white", cursor: "pointer", fontSize: "13px" },
};

export default MisFacturas;