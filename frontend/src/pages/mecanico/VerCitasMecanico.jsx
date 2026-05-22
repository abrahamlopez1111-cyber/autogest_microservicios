import { useEffect, useState } from "react";

const GATEWAY = "https://autogest-gateway.onrender.com";

function VerCitasMecanico() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarCitas();
  }, []);

  const cargarCitas = async () => {
    try {
      const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
      if (!usuario) return;

      // 1. obtener mecánico desde microservicio de CITAS (no usuarios)
      const resMecanicos = await fetch(`${GATEWAY}/mecanicos-citas`);
      const mecanicos = await resMecanicos.json();
      const mecanico = mecanicos.find((m) => m.usuario_id === usuario.id_usuarios);

      if (!mecanico) {
        setLoading(false);
        return;
      }

      // 2. traer citas usando id real de la tabla mecanicos
      const resCitas = await fetch(`${GATEWAY}/citas/mecanico/${mecanico.id}`);
      const citasData = await resCitas.json();

      // 3. datos extra
      const [resSuc, resUsuarios] = await Promise.all([
        fetch(`${GATEWAY}/sucursales`),
        fetch(`${GATEWAY}/usuarios`),
      ]);

      const sucursales = await resSuc.json();
      const usuarios = await resUsuarios.json();

      // 4. enriquecer
      const citasFinal = (Array.isArray(citasData) ? citasData : []).map((c) => ({
        ...c,
        sucursal_nombre: sucursales.find((s) => s.id === c.sucursal_id)?.nombre || "N/A",
        cliente_nombre: usuarios.find((u) => u.id_usuarios === c.usuario_id)?.nombre || "Cliente",
      }));

      setCitas(citasFinal);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      dateStyle: "short",
      timeStyle: "short",
    });

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Citas Asignadas</h2>

      {loading ? (
        <p style={styles.msg}>Cargando...</p>
      ) : citas.length === 0 ? (
        <p style={styles.msg}>No tienes citas asignadas</p>
      ) : (
        citas.map((c) => (
          <div key={c.id} style={styles.card}>
            <p><strong>Cliente:</strong> {c.cliente_nombre}</p>
            <p><strong>Sucursal:</strong> {c.sucursal_nombre}</p>
            <p><strong>Estado:</strong> {c.estado}</p>
            <p><strong>Inicio:</strong> {formatearFecha(c.fecha_hora_inicio)}</p>
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: { maxWidth: "600px", margin: "auto", color: "white" },
  title: { textAlign: "center", marginBottom: "20px" },
  msg: { textAlign: "center", color: "#94a3b8" },
  card: {
    background: "#1e293b",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
  },
};

export default VerCitasMecanico;