import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const GATEWAY =
  "https://autogest-gateway.onrender.com";

function FacturacionRecepcionista() {

  const navigate = useNavigate();

  const [citas, setCitas] = useState([]);
  const [preview, setPreview] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // INICIO
  // =========================
  useEffect(() => {
    cargarCitas();
  }, []);

  // =========================
  // CARGAR CITAS
  // =========================
  const cargarCitas = async () => {

    try {

      setLoading(true);

      const usuario = JSON.parse(
        localStorage.getItem("usuario") ||
          "null"
      );

      if (!usuario) {
        setLoading(false);
        return;
      }

      // =========================
      // RECEPCIONISTAS
      // =========================
      const resRecep =
        await fetch(
          `${GATEWAY}/recepcionistas`
        );

      if (!resRecep.ok) {
        throw new Error(
          "Error obteniendo recepcionistas"
        );
      }

      const recepcionistas =
        await resRecep.json();

      const recepcionista =
        recepcionistas.find(
          (r) =>
            Number(r.usuario_id) ===
            Number(usuario.id_usuarios)
        );

      if (!recepcionista) {

        setCitas([]);
        setLoading(false);

        return;
      }

      // =========================
      // CITAS SUCURSAL
      // =========================
      const resCitas =
        await fetch(
          `${GATEWAY}/citas/sucursal/${recepcionista.sucursal_id}`
        );

      if (!resCitas.ok) {
        throw new Error(
          "Error obteniendo citas"
        );
      }

      const data =
        await resCitas.json();

      console.log(
        "📅 Citas:",
        data
      );

      // =========================
      // FILTRAR FINALIZADAS
      // =========================
      const finalizadas = (
        Array.isArray(data)
          ? data
          : []
      ).filter((c) => {

        const estado = (
          c.estado || ""
        )
          .toLowerCase()
          .trim();

        return (
          estado === "finalizada"
        );
      });

      console.log(
        "✅ Finalizadas:",
        finalizadas
      );

      // =========================
      // CARGAR PREVIEW AUTOMÁTICO
      // =========================
      const citasConInfo =
        await Promise.all(

          finalizadas.map(
            async (cita) => {

              try {

                const resPreview =
                  await fetch(
                    `${GATEWAY}/facturas/preview/${cita.id}`
                  );

                if (!resPreview.ok) {
                  return cita;
                }

                const previewData =
                  await resPreview.json();

                return {

                  ...cita,

                  cliente:
                    previewData.cliente,

                  vehiculo:
                    previewData.vehiculo
                };

              } catch (error) {

                console.error(
                  "❌ Error preview:",
                  error
                );

                return cita;
              }
            }
          )
        );

      console.log(
        "🚗 Citas completas:",
        citasConInfo
      );

      setCitas(citasConInfo);

    } catch (error) {

      console.error(
        "❌ Error:",
        error
      );

      setCitas([]);

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // VER PREVIEW
  // =========================
  const verPreview = async (
    citaId
  ) => {

    try {

      const res = await fetch(
        `${GATEWAY}/facturas/preview/${citaId}`
      );

      const contentType =
        res.headers.get(
          "content-type"
        );

      if (
        !contentType ||
        !contentType.includes(
          "application/json"
        )
      ) {

        const texto =
          await res.text();

        console.error(
          "❌ Respuesta inválida:",
          texto
        );

        alert(
          "El servidor devolvió una respuesta inválida"
        );

        return;
      }

      const data =
        await res.json();

      console.log(
        "📄 Preview:",
        data
      );

      if (!res.ok) {

        alert(
          data.detail ||
            "Error cargando preview"
        );

        return;
      }

      setPreview({
        ...data,
        cita_id: citaId,
      });

    } catch (error) {

      console.error(error);

      alert(
        "Error de conexión"
      );
    }
  };

  // =========================
  // EMITIR FACTURA
  // =========================
  const emitirFactura = async () => {

    try {

      if (!preview) {

        alert(
          "No hay preview disponible"
        );

        return;
      }

      const res = await fetch(
        `${GATEWAY}/facturas/${preview.cita_id}`,
        {
          method: "POST",
        }
      );

      const contentType =
        res.headers.get(
          "content-type"
        );

      if (
        !contentType ||
        !contentType.includes(
          "application/json"
        )
      ) {

        const texto =
          await res.text();

        console.error(
          "❌ Respuesta inválida:",
          texto
        );

        alert(
          "El servidor devolvió una respuesta inválida"
        );

        return;
      }

      const data =
        await res.json();

      console.log(
        "🧾 Factura:",
        data
      );

      let facturaId = null;

      // =========================
      // FACTURA NUEVA
      // =========================
      if (
        res.ok &&
        data.factura
      ) {

        facturaId =
          data.factura.id;
      }

      // =========================
      // FACTURA EXISTENTE
      // =========================
      else if (
        data.detail ===
        "Esta cita ya tiene factura"
      ) {

        const resFacturas =
          await fetch(
            `${GATEWAY}/facturas`
          );

        if (!resFacturas.ok) {
          throw new Error(
            "Error obteniendo facturas"
          );
        }

        const facturas =
          await resFacturas.json();

        const facturaExistente =
          facturas.find(
            (f) =>
              Number(f.cita_id) ===
              Number(
                preview.cita_id
              )
          );

        facturaId =
          facturaExistente?.id;
      }

      if (!facturaId) {

        alert(
          "No se pudo obtener la factura"
        );

        return;
      }

      // =========================
      // PDF
      // =========================
      const pdfUrl =
        `${GATEWAY}/facturas/${facturaId}/pdf`;

      console.log(
        "📄 PDF:",
        pdfUrl
      );

      window.open(
        pdfUrl,
        "_blank"
      );

      // =========================
      // LIMPIAR UI
      // =========================
      setCitas(
        citas.filter(
          (c) =>
            c.id !==
            preview.cita_id
        )
      );

      setPreview(null);

      alert(
        "✅ Factura emitida correctamente"
      );

    } catch (error) {

      console.error(error);

      alert(
        "Error generando factura"
      );
    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <p style={styles.text}>
        Cargando...
      </p>
    );
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div style={styles.container}>

      <button
        style={styles.btnVolver}
        onClick={() =>
          navigate("/recepcionista")
        }
      >
        ⬅ Volver
      </button>

      <h2 style={styles.title}>
        💰 Facturación
      </h2>

      {!preview && (

        <>
          {citas.length === 0 ? (

            <p style={styles.textCenter}>
              No hay vehículos pendientes de facturar
            </p>

          ) : (

            citas.map((cita) => (

              <button
                key={cita.id}
                style={styles.card}
                onClick={() =>
                  verPreview(cita.id)
                }
              >

                <p>
                  <strong>
                    📄 Pre-factura:
                  </strong>{" "}
                  #{cita.id}
                </p>

                <p>
                  <strong>
                    👤 Cliente:
                  </strong>{" "}
                  {cita.cliente?.nombre ||
                    "N/A"}
                </p>

                <p>
                  <strong>
                    🚗 Vehículo:
                  </strong>{" "}
                  {cita.vehiculo?.placa ||
                    "N/A"}
                </p>

              </button>
            ))
          )}
        </>
      )}

      {/* PREVIEW */}
      {preview && (

        <div style={styles.preview}>

          <h3>
            Vista previa
          </h3>

          <p>
            <strong>
              Cliente:
            </strong>{" "}
            {preview.cliente?.nombre ||
              "N/A"}
          </p>

          <p>
            <strong>
              Vehículo:
            </strong>{" "}
            {preview.vehiculo?.placa ||
              "N/A"}
          </p>

          <p>
            <strong>
              Observación:
            </strong>{" "}
            {preview.observacion_cliente ||
              "N/A"}
          </p>

          <p>
            <strong>
              Falla:
            </strong>{" "}
            {preview.descripcion_falla ||
              "N/A"}
          </p>

          <p>
            <strong>
              Reparación:
            </strong>{" "}
            {preview.reparacion_realizada ||
              "N/A"}
          </p>

          <hr />

          <h4>
            🔧 Repuestos
          </h4>

          {preview.repuestos?.length > 0 ? (

            preview.repuestos.map(
              (r, i) => (

                <div
                  key={i}
                  style={styles.repuesto}
                >

                  <p>
                    <strong>
                      {r.nombre}
                    </strong>
                  </p>

                  <p>
                    Cantidad: {r.cantidad}
                  </p>

                  <p>
                    Unitario: $
                    {r.precio_unitario}
                  </p>

                  <p>
                    Subtotal: $
                    {r.subtotal}
                  </p>

                </div>
              )
            )

          ) : (

            <p>
              No hay repuestos
            </p>
          )}

          <hr />

          <p>
            <strong>
              Mano de obra:
            </strong>{" "}
            $
            {preview.mano_obra}
          </p>

          <p>
            <strong>
              IVA:
            </strong>{" "}
            $
            {preview.iva}
          </p>

          <p>
            <strong>
              TOTAL:
            </strong>{" "}
            $
            {preview.total}
          </p>

          <button
            style={styles.emitir}
            onClick={
              emitirFactura
            }
          >
            Emitir factura
          </button>

          <button
            style={styles.volver}
            onClick={() =>
              setPreview(null)
            }
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
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  title: {
    marginBottom: "20px",
    textAlign: "center",
  },

  text: {
    color: "white",
  },

  textCenter: {
    color: "#94a3b8",
    textAlign: "center",
    marginTop: "80px",
    fontSize: "16px",
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
    textAlign: "left",
  },

  preview: {
    background: "#1e293b",
    padding: "25px",
    borderRadius: "15px",
    width: "100%",
    maxWidth: "700px",
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

  btnVolver: {
    background: "#334155",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px",
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
  },
};