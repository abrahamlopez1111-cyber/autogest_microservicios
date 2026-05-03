import { useEffect, useState } from "react";

function FacturacionRecepcionista() {

  const [citas, setCitas] = useState([]);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // CARGAR CITAS FINALIZADAS
  // =========================
  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {

      const usuario = JSON.parse(localStorage.getItem("usuario"));
      if (!usuario) return;

      // recepcionista
      const resRecep = await fetch("http://localhost:8000/recepcionistas");
      const recepcionistas = await resRecep.json();

      const recepcionista = recepcionistas.find(
        (r) => r.usuario_id === usuario.id_usuarios
      );

      if (!recepcionista) return;

      // citas sucursal
      const resCitas = await fetch(
        `http://localhost:8000/citas/sucursal/${recepcionista.sucursal_id}`
      );

      const data = await resCitas.json();

      const finalizadas = data.filter(
        (c) => c.estado === "finalizada"
      );

      setCitas(finalizadas);

    } catch (error) {
      console.log("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // PREVIEW FACTURA
  // =========================
  const verPreview = async (citaId) => {
    try {

      const res = await fetch(
        `http://localhost:8006/facturas/preview/${citaId}`
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.detail || "Error cargando preview");
        return;
      }

      setPreview({
        ...data,
        cita_id: citaId
      });

    } catch {
      alert("Error de conexión");
    }
  };

  // =========================
  // 🔥 EMITIR + DESCARGAR PDF (CORREGIDO)
  // =========================
  const emitirFactura = async () => {
    try {

      // 1. intentar crear factura
      const res = await fetch(
        `http://localhost:8006/facturas/${preview.cita_id}`,
        { method: "POST" }
      );

      const data = await res.json();

      let facturaId = null;

      // 2. si se creó correctamente
      if (res.ok && data.factura) {
        facturaId = data.factura.id;
      }

      // 3. si ya existía → buscarla
      else if (data.detail === "Esta cita ya tiene factura") {

        const resFacturas = await fetch(
          "http://localhost:8006/facturas"
        );

        const facturas = await resFacturas.json();

        const facturaExistente = facturas.find(
          f => f.cita_id === preview.cita_id
        );

        facturaId = facturaExistente?.id;
      }

      // 4. validar
      if (!facturaId) {
        alert("No se pudo obtener la factura");
        return;
      }

      // 5. 🔥 descargar PDF correctamente
      window.open(
        `http://localhost:8006/facturas/${facturaId}/pdf`,
        "_blank"
      );

      // 6. limpiar UI
      setCitas(
        citas.filter(c => c.id !== preview.cita_id)
      );

      setPreview(null);

      alert("Factura lista y descargada");

    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {
    return <p style={styles.text}>Cargando...</p>;
  }

  return (
    <div style={styles.container}>

      <h2 style={styles.title}>💰 Facturación</h2>

      {/* LISTADO */}
      {!preview && (
        <>
          {citas.length === 0 ? (
            <p style={styles.text}>
              No hay vehículos pendientes
            </p>
          ) : (
            citas.map((cita) => (
              <button
                key={cita.id}
                style={styles.card}
                onClick={() => verPreview(cita.id)}
              >
                Ver pre-factura #{cita.id}
              </button>
            ))
          )}
        </>
      )}

      {/* PREVIEW */}
      {preview && (
        <div style={styles.preview}>

          <h3>Vista previa</h3>

          <p><strong>Cliente:</strong> {preview.cliente?.nombre}</p>
          <p><strong>Vehículo:</strong> {preview.vehiculo?.placa}</p>
          <p><strong>Observación:</strong> {preview.observacion_cliente}</p>
          <p><strong>Falla:</strong> {preview.descripcion_falla}</p>
          <p><strong>Reparación:</strong> {preview.reparacion_realizada}</p>

          <hr />

          <h4>🔧 Repuestos</h4>

          {preview.repuestos?.map((r, i) => (
            <div key={i} style={styles.repuesto}>
              <p><strong>{r.nombre}</strong></p>
              <p>Cantidad: {r.cantidad}</p>
              <p>Unitario: $ {r.precio_unitario}</p>
              <p>Subtotal: $ {r.subtotal}</p>
            </div>
          ))}

          <hr />

          <p><strong>Mano de obra:</strong> $ {preview.mano_obra}</p>
          <p><strong>IVA:</strong> $ {preview.iva}</p>
          <p><strong>TOTAL:</strong> $ {preview.total}</p>

          <button
            style={styles.emitir}
            onClick={emitirFactura}
          >
            Emitir factura
          </button>

          <button
            style={styles.volver}
            onClick={() => setPreview(null)}
          >
            Volver
          </button>

        </div>
      )}

    </div>
  );
}

export default FacturacionRecepcionista;

const styles = {
  container: {
    padding: "30px",
    background: "#0f172a",
    minHeight: "100vh",
    color: "white",
  },
  title: {
    marginBottom: "20px",
  },
  text: {
    color: "white",
  },
  card: {
    width: "100%",
    padding: "18px",
    marginBottom: "12px",
    borderRadius: "12px",
    border: "none",
    cursor: "pointer",
    background: "#1e293b",
    color: "white",
    fontSize: "16px",
  },
  preview: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "15px",
  },
  repuesto: {
    background: "#334155",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "10px",
  },
  emitir: {
    width: "100%",
    padding: "15px",
    marginTop: "20px",
    background: "#16a34a",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
  volver: {
    width: "100%",
    padding: "15px",
    marginTop: "10px",
    background: "#475569",
    border: "none",
    borderRadius: "10px",
    color: "white",
    cursor: "pointer",
  }
};