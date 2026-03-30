import { useState, useEffect } from "react";
import {
  crearSucursal,
  getSucursales,
} from "../../services/citasApi";

function SucursalesPanel({ volver }) {
  const [sucursales, setSucursales] = useState([]);

  const [nueva, setNueva] = useState({
    nombre: "",
    pais: "",
    capacidad_elevadores: "",
  });

  const cargarSucursales = async () => {
    const data = await getSucursales();
    setSucursales(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    cargarSucursales();
  }, []);

  const handleCrear = async () => {
    if (!nueva.nombre || !nueva.pais) {
      alert("Completa los campos");
      return;
    }

    await crearSucursal({
      ...nueva,
      capacidad_elevadores: Number(nueva.capacidad_elevadores),
    });

    setNueva({
      nombre: "",
      pais: "",
      capacidad_elevadores: "",
    });

    cargarSucursales();
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🏢 Gestión de Sucursales</h2>

      {/* FORM */}
      <div style={styles.card}>
        <h3>Crear Sucursal</h3>

        <div style={styles.form}>
          <input
            style={styles.input}
            placeholder="Nombre"
            value={nueva.nombre}
            onChange={(e) =>
              setNueva({ ...nueva, nombre: e.target.value })
            }
          />

          <input
            style={styles.input}
            placeholder="País"
            value={nueva.pais}
            onChange={(e) =>
              setNueva({ ...nueva, pais: e.target.value })
            }
          />

          <input
            style={styles.input}
            placeholder="Capacidad"
            type="number"
            value={nueva.capacidad_elevadores}
            onChange={(e) =>
              setNueva({
                ...nueva,
                capacidad_elevadores: e.target.value,
              })
            }
          />

          <button style={styles.btnCrear} onClick={handleCrear}>
            ➕ Crear Sucursal
          </button>
        </div>
      </div>

      {/* LISTA */}
      <div style={styles.card}>
        <h3>Lista de Sucursales</h3>

        {sucursales.length === 0 ? (
          <p>No hay sucursales</p>
        ) : (
          sucursales.map((s) => (
            <div key={s.id} style={styles.item}>
              <div>
                <strong>{s.nombre}</strong>
                <p style={styles.sub}>{s.pais}</p>
                <span style={styles.badge}>
                  Elevadores: {s.capacidad_elevadores}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      <button style={styles.btnVolver} onClick={volver}>
        ⬅ Volver
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "900px",
    margin: "auto",
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  card: {
    background: "#1f2937",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
  },

  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #374151",
    background: "#111827",
    color: "white",
    flex: "1",
    minWidth: "150px",
  },

  btnCrear: {
    background: "#2563eb",
    color: "white",
    border: "none",
    padding: "10px 15px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  item: {
    padding: "12px",
    borderBottom: "1px solid #374151",
  },

  sub: {
    margin: 0,
    fontSize: "12px",
    color: "#9ca3af",
  },

  badge: {
    background: "#10b981",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    marginTop: "5px",
    display: "inline-block",
  },

  btnVolver: {
    marginTop: "10px",
    background: "#374151",
    color: "white",
    border: "none",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default SucursalesPanel;