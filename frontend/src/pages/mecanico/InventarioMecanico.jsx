import { useEffect, useState } from "react";

const GATEWAY = "https://autogest-gateway.onrender.com";

function InventarioMecanico() {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState("");
  const [sucursalId, setSucursalId] = useState(null);

  useEffect(() => {
    cargarInventario();
  }, []);

  const cargarInventario = async () => {
    try {
      setLoading(true);
      const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
      if (!usuario) return;

      // Obtener sucursal del mecánico
      const resMecanicos = await fetch(`${GATEWAY}/mecanicos-citas`);
      const mecanicos = await resMecanicos.json();
      const mecanico = mecanicos.find((m) => m.usuario_id === usuario.id_usuarios);

      if (!mecanico) return;
      setSucursalId(mecanico.sucursal_id);

      // Obtener inventario completo
      const res = await fetch(`${GATEWAY}/inventario/repuestos/inventario-completo`);
      const data = await res.json();

      // Filtrar por sucursal del mecánico
      const filtrados = data.filter((p) => p.sucursal_id === mecanico.sucursal_id);
      setProductos(filtrados);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const filtrados = productos.filter((p) =>
    p.nombre?.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📦 Inventario de Repuestos</h2>

      <input
        style={styles.buscar}
        placeholder="🔍 Buscar repuesto..."
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />

      {loading ? (
        <p style={styles.msg}>Cargando...</p>
      ) : filtrados.length === 0 ? (
        <p style={styles.msg}>No hay repuestos disponibles</p>
      ) : (
        <div>
          {filtrados.map((p) => (
            <div key={p.id} style={styles.card}>
              <div style={styles.cardRow}>
                <strong style={styles.nombre}>{p.nombre}</strong>
                <span style={{
                  ...styles.stock,
                  background: p.cantidad > 5 ? "#16a34a" : p.cantidad > 0 ? "#d97706" : "#dc2626"
                }}>
                  {p.cantidad > 0 ? `${p.cantidad} disponibles` : "Sin stock"}
                </span>
              </div>
              <p style={styles.precio}>${Number(p.precio).toLocaleString("es-CO")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "auto", color: "white" },
  title: { textAlign: "center", marginBottom: "16px" },
  buscar: { width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #334155", background: "#1e293b", color: "white", marginBottom: "16px", boxSizing: "border-box" },
  msg: { textAlign: "center", color: "#94a3b8" },
  card: { background: "#1e293b", padding: "14px 18px", marginBottom: "10px", borderRadius: "10px" },
  cardRow: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" },
  nombre: { fontSize: "14px" },
  stock: { fontSize: "12px", padding: "3px 10px", borderRadius: "20px", color: "white", fontWeight: "500" },
  precio: { margin: "6px 0 0", color: "#22c55e", fontWeight: "bold" },
};

export default InventarioMecanico;