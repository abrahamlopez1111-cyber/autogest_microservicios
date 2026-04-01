import { useEffect, useState } from "react";

function MisCitas() {
  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  useEffect(() => {
    if (!usuario) return;

    let ejecutado = false;

    const cargarDatos = async () => {
      if (ejecutado) return;
      ejecutado = true;

      try {
        setLoading(true);

        const [resCitas, resSuc, resUsuarios, resMec] = await Promise.all([
          fetch("http://localhost:8000/citas"),
          fetch("http://localhost:8000/sucursales"),
          fetch("http://localhost:8002/usuarios"),
          fetch("http://localhost:8000/mecanicos"),
        ]);

        const citasData = await resCitas.json();
        const sucursales = await resSuc.json();
        const usuarios = await resUsuarios.json();
        const mecanicos = await resMec.json();

        // 🔥 FILTRAR CITAS DEL USUARIO
        const citasUsuario = citasData.filter(
          (c) => c.usuario_id === usuario.id_usuarios
        );

        // 🔥 RELACIÓN CORRECTA
        const citasEnriquecidas = citasUsuario.map((c) => {
          const sucursal = sucursales.find(
            (s) => s.id === c.sucursal_id
          );

          const mecanico = mecanicos.find(
            (m) => m.id === c.mecanico_id
          );

          const usuarioMecanico = usuarios.find(
            (u) => u.id_usuarios === mecanico?.usuario_id
          );

          return {
            ...c,
            sucursal_nombre: sucursal?.nombre || "N/A",
            mecanico_nombre: usuarioMecanico
              ? usuarioMecanico.nombre
              : "Desconocido",
          };
        });

        setCitas(citasEnriquecidas);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, []);

  // =========================
  // ❌ ELIMINAR CITA
  // =========================
  const eliminarCita = async (id) => {
    const confirmar = confirm("¿Seguro que quieres cancelar esta cita?");
    if (!confirmar) return;

    try {
      const res = await fetch(`http://localhost:8000/citas/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Error eliminando cita");
        return;
      }

      // 🔥 ACTUALIZA UI
      setCitas((prev) => prev.filter((c) => c.id !== id));

    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // 📅 FORMATO
  // =========================
  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-CO", {
      timeZone: "America/Bogota",
      dateStyle: "short",
      timeStyle: "short",
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📋 Mis Citas</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : citas.length === 0 ? (
        <p>No tienes citas</p>
      ) : (
        citas.map((c) => (
          <div key={c.id} style={styles.card}>
            <p><strong>Sucursal:</strong> {c.sucursal_nombre}</p>
            <p><strong>Mecánico:</strong> {c.mecanico_nombre}</p>
            <p><strong>Estado:</strong> {c.estado}</p>
            <p><strong>Inicio:</strong> {formatearFecha(c.fecha_hora_inicio)}</p>

            {c.estado !== "cancelada" && (
              <button
                style={styles.btnEliminar}
                onClick={() => eliminarCita(c.id)}
              >
                ❌ Cancelar cita
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "20px",
    maxWidth: "600px",
    marginInline: "auto",
    color: "white",
  },
  title: { textAlign: "center" },
  card: {
    background: "#1e293b",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
  },
  btnEliminar: {
    marginTop: "10px",
    background: "#ef4444",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },
};

export default MisCitas;