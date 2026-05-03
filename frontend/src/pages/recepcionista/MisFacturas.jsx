import { useEffect, useState } from "react";

function MisFacturas() {

  const [facturas, setFacturas] = useState([]);

  useEffect(() => {
    cargarFacturas();
  }, []);

  const cargarFacturas = async () => {

    const res = await fetch(
      "http://localhost:8006/facturas"
    );

    const data = await res.json();

    setFacturas(data);
  };

  const descargarFactura = (id) => {

    window.open(
      `http://localhost:8006/facturas/${id}/pdf`,
      "_blank"
    );
  };

  return (
    <div style={{ color: "white", padding: "30px" }}>

      <h2>💰 Facturas generadas</h2>

      {facturas.map((f) => (

        <div
          key={f.id}
          style={{
            background: "#1e293b",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px"
          }}
        >
          <p>Factura: {f.numero_factura}</p>
          <p>Total: ${f.total}</p>

          <button
            onClick={() => descargarFactura(f.id)}
          >
            Descargar
          </button>

        </div>

      ))}

    </div>
  );
}

export default MisFacturas;