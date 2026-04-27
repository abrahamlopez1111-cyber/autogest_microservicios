import { useEffect, useState } from "react";

function RecepcionistasPanel({ volver }) {
  const [recepcionistas, setRecepcionistas] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [asignados, setAsignados] = useState([]);

  const [recepcionistaSeleccionado, setRecepcionistaSeleccionado] = useState("");
  const [sucursalSeleccionada, setSucursalSeleccionada] = useState("");

  // =========================
  // 🔥 CARGAR DATOS
  // =========================
  useEffect(() => {
    cargarRecepcionistas();
    cargarSucursales();
  }, []);

  const cargarRecepcionistas = async () => {
    try {
      const res = await fetch("http://localhost:8002/recepcionistas");
      const data = await res.json();
      setRecepcionistas(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarSucursales = async () => {
    try {
      const res = await fetch("http://localhost:8000/sucursales");
      const data = await res.json();
      setSucursales(data);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // 🔥 ASIGNAR
  // =========================
  const asignar = async () => {
    if (!recepcionistaSeleccionado || !sucursalSeleccionada) {
      alert("Debes seleccionar recepcionista y sucursal");
      return;
    }

    try {
      await fetch(
        `http://localhost:8002/usuarios/${recepcionistaSeleccionado}/asignar-sucursal?sucursal_id=${sucursalSeleccionada}`,
        { method: "PUT" }
      );

      const recepcionista = recepcionistas.find(
        (r) => r.id_usuarios == recepcionistaSeleccionado
      );

      const sucursal = sucursales.find(
        (s) => s.id == sucursalSeleccionada
      );

      setAsignados([
        ...asignados,
        {
          nombre: recepcionista.nombre,
          sucursal: sucursal.nombre,
        },
      ]);

      alert("Asignado correctamente ✅");

    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🧑‍💼 Gestión de Recepcionistas</h2>

      {/* 🔹 FORMULARIO */}
      <div style={styles.card}>
        <h3>Asignar Recepcionista</h3>

        <div style={styles.form}>
          <select
            value={recepcionistaSeleccionado}
            onChange={(e) => setRecepcionistaSeleccionado(e.target.value)}
            style={styles.select}
          >
            <option value="">Seleccione recepcionista</option>
            {recepcionistas.map((r) => (
              <option key={r.id_usuarios} value={r.id_usuarios}>
                {r.nombre}
              </option>
            ))}
          </select>

          <select
            value={sucursalSeleccionada}
            onChange={(e) => setSucursalSeleccionada(e.target.value)}
            style={styles.select}
          >
            <option value="">Seleccione sucursal</option>
            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>

          <button style={styles.btn} onClick={asignar}>
            + Asignar
          </button>
        </div>
      </div>

      {/* 🔹 LISTA */}
      <div style={styles.card}>
        <h3>Recepcionistas Asignados</h3>

        {asignados.length === 0 ? (
          <p style={{ color: "#9ca3af" }}>
            No hay recepcionistas asignados
          </p>
        ) : (
          asignados.map((a, index) => (
            <div key={index} style={styles.item}>
              <span>{a.nombre}</span>
              <span>{a.sucursal}</span>
            </div>
          ))
        )}
      </div>

      <button style={styles.backBtn} onClick={volver}>
        ← Volver
      </button>
    </div>
  );
}

// =========================
// 🎨 ESTILOS (MISMO ESTILO MECÁNICOS)
// =========================
const styles = {
  container: {
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },

  form: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },

  select: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    background: "#0f172a",
    color: "white",
  },

  btn: {
    padding: "10px 15px",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    padding: "10px",
    background: "#0f172a",
    borderRadius: "8px",
    marginTop: "10px",
  },

  backBtn: {
    marginTop: "10px",
    padding: "10px",
    background: "#334155",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },
};

export default RecepcionistasPanel;