import { useEffect, useState } from "react";

const GATEWAY =
  "https://autogest-gateway.onrender.com";

function MisFacturas() {

  const [facturas, setFacturas] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // INICIO
  // =========================
  useEffect(() => {
    cargarFacturas();
  }, []);

  // =========================
  // CARGAR FACTURAS
  // =========================
  const cargarFacturas = async () => {

    try {

      setLoading(true);

      // =========================
      // USUARIO
      // =========================
      const usuario = JSON.parse(
        localStorage.getItem("usuario") ||
          "null"
      );

      if (!usuario) {

        setFacturas([]);
        setLoading(false);

        return;
      }

      console.log(
        "👤 Usuario:",
        usuario
      );

      // =========================
      // FACTURAS CLIENTE
      // =========================
      const res = await fetch(
        `${GATEWAY}/facturas/cliente/${usuario.id_usuarios}`
      );

      if (!res.ok) {

        throw new Error(
          "Error obteniendo facturas"
        );
      }

      const data =
        await res.json();

      console.log(
        "💰 Facturas:",
        data
      );

      setFacturas(
        Array.isArray(data)
          ? data
          : []
      );

    } catch (error) {

      console.error(
        "❌ Error:",
        error
      );

      setFacturas([]);

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // DESCARGAR PDF
  // =========================
  const descargarPDF = (
    facturaId
  ) => {

    const url =
      `${GATEWAY}/facturas/${facturaId}/pdf`;

    console.log(
      "📄 PDF:",
      url
    );

    window.open(
      url,
      "_blank"
    );
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <p style={styles.loading}>
        Cargando facturas...
      </p>
    );
  }

  // =========================
  // SIN FACTURAS
  // =========================
  if (facturas.length === 0) {

    return (
      <div style={styles.empty}>
        <h3>
          💰 Mis Facturas
        </h3>

        <p>
          No tienes facturas disponibles
        </p>
      </div>
    );
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div>

      <h2 style={styles.title}>
        💰 Mis Facturas
      </h2>

      <div style={styles.grid}>

        {facturas.map((factura) => (

          <div
            key={factura.id}
            style={styles.card}
          >

            <h3>
              📄 {
                factura.numero_factura ||
                `Factura #${factura.id}`
              }
            </h3>

            <p>
              <strong>
                Estado:
              </strong>{" "}
              {
                factura.estado_pago ||
                "Pendiente"
              }
            </p>

            <p>
              <strong>
                Total:
              </strong>{" "}
              $
              {
                Number(
                  factura.total || 0
                ).toLocaleString()
              }
            </p>

            <p>
              <strong>
                Subtotal:
              </strong>{" "}
              $
              {
                Number(
                  factura.subtotal || 0
                ).toLocaleString()
              }
            </p>

            <p>
              <strong>
                IVA:
              </strong>{" "}
              $
              {
                Number(
                  factura.impuestos || 0
                ).toLocaleString()
              }
            </p>

            {/* PDF */}
            <button
              style={styles.btn}
              onClick={() =>
                descargarPDF(
                  factura.id
                )
              }
            >
              📥 Descargar PDF
            </button>

          </div>
        ))}

      </div>
    </div>
  );
}

export default MisFacturas;

const styles = {

  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "white",
  },

  loading: {
    color: "white",
    textAlign: "center",
    marginTop: "50px",
  },

  empty: {
    textAlign: "center",
    color: "white",
    marginTop: "50px",
  },

  grid: {
    display: "flex",
    flexWrap: "wrap",
    gap: "20px",
    justifyContent: "center",
  },

  card: {
    background: "#1e293b",
    color: "white",
    borderRadius: "12px",
    padding: "20px",
    width: "320px",
    boxShadow:
      "0 0 10px rgba(0,0,0,0.3)",
  },

  btn: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    border: "none",
    borderRadius: "8px",
    background: "#16a34a",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};