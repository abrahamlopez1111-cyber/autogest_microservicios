/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
import { useState, useEffect } from "react";
import { getUsuarios } from "../../services/usuariosApi";
import {
  getMecanicos,
  crearMecanico,
  getSucursales,
} from "../../services/citasApi";

function MecanicosPanel({ volver }) {
  const [mecanicos, setMecanicos] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [disponibles, setDisponibles] = useState([]);

  const [nuevo, setNuevo] = useState({
    usuario_id: "",
    sucursal_id: "",
  });

  // =========================
  // 🔥 CARGAR DATOS
  // =========================
  const cargarDatos = async () => {
    try {
      const usuariosData = await getUsuarios();
      const mecanicosDB = await getMecanicos();
      const suc = await getSucursales();

      // 🔥 SOLO USUARIOS MECÁNICOS
      const usuariosMecanicos = usuariosData.filter(
        (u) => u.rol === "mecanico"
      );

      // 🔥 IDs YA ASIGNADOS
      const idsAsignados = mecanicosDB.map((m) => m.usuario_id);

      // 🔥 DISPONIBLES (NO ASIGNADOS)
      const disponibles = usuariosMecanicos.filter(
        (u) => !idsAsignados.includes(u.id_usuarios)
      );

      setUsuarios(usuariosData);
      setMecanicos(mecanicosDB);
      setSucursales(suc);
      setDisponibles(disponibles);

    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // =========================
  // ➕ CREAR MECÁNICO
  // =========================
  const handleCrear = async () => {
    if (!nuevo.usuario_id || !nuevo.sucursal_id) {
      alert("Selecciona datos");
      return;
    }

    try {
      await crearMecanico({
        usuario_id: Number(nuevo.usuario_id),
        sucursal_id: Number(nuevo.sucursal_id),
      });

      setNuevo({ usuario_id: "", sucursal_id: "" });
      cargarDatos();

    } catch (error) {
      alert("Error creando mecánico");
    }
  };

  // =========================
  // ❌ ELIMINAR MECÁNICO
  // =========================
  const eliminarMecanico = async (id) => {
    if (!confirm("¿Eliminar asignación?")) return;

    try {
      const res = await fetch(`http://localhost:8000/mecanicos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        alert("Error eliminando");
        return;
      }

      cargarDatos();

    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // 🧠 HELPERS
  // =========================
  const getNombreUsuario = (id) => {
    const user = usuarios.find((u) => u.id_usuarios === id);

    // 🔥 SEGURIDAD EXTRA (por si algo raro pasa)
    if (!user || user.rol !== "mecanico") {
      return "⚠️ No válido";
    }

    return user.nombre;
  };

  const getNombreSucursal = (id) => {
    const suc = sucursales.find((s) => s.id === id);
    return suc ? suc.nombre : "Desconocida";
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🔧 Gestión de Mecánicos</h2>

      {/* FORM */}
      <div style={styles.card}>
        <h3>Asignar Mecánico</h3>

        <div style={styles.form}>
          <select
            style={styles.input}
            value={nuevo.usuario_id}
            onChange={(e) =>
              setNuevo({ ...nuevo, usuario_id: e.target.value })
            }
          >
            <option value="">Seleccione mecánico</option>

            {disponibles.map((u) => (
              <option key={u.id_usuarios} value={u.id_usuarios}>
                {u.nombre}
              </option>
            ))}
          </select>

          <select
            style={styles.input}
            value={nuevo.sucursal_id}
            onChange={(e) =>
              setNuevo({ ...nuevo, sucursal_id: e.target.value })
            }
          >
            <option value="">Seleccione sucursal</option>

            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>

          <button style={styles.btnCrear} onClick={handleCrear}>
            ➕ Asignar
          </button>
        </div>
      </div>

      {/* LISTA */}
      <div style={styles.card}>
        <h3>Mecánicos Asignados</h3>

        {mecanicos.length === 0 ? (
          <p>No hay mecánicos asignados</p>
        ) : (
          mecanicos.map((m) => (
            <div key={m.id} style={styles.item}>
              <div>
                <strong>{getNombreUsuario(m.usuario_id)}</strong>
                <p style={styles.sub}>
                  {getNombreSucursal(m.sucursal_id)}
                </p>
              </div>

              {/* 🔥 BOTONES */}
              <div style={styles.actions}>
                <span style={styles.badge}>Asignado</span>

                <button
                  style={styles.btnEliminar}
                  onClick={() => eliminarMecanico(m.id)}
                >
                  ❌
                </button>
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

// 🎨 estilos
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
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
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
  },

  actions: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  btnEliminar: {
    background: "#ef4444",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
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

export default MecanicosPanel;