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

  const cargarDatos = async () => {
    const usuariosData = await getUsuarios();
    const mecanicosDB = await getMecanicos();
    const suc = await getSucursales();

    const usuariosMecanicos = usuariosData.filter(
      (u) => u.rol === "mecanico"
    );

    const idsAsignados = mecanicosDB.map((m) => m.usuario_id);

    const disponibles = usuariosMecanicos.filter(
      (u) => !idsAsignados.includes(u.id_usuarios)
    );

    setUsuarios(usuariosData);
    setMecanicos(mecanicosDB);
    setSucursales(suc);
    setDisponibles(disponibles);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleCrear = async () => {
    if (!nuevo.usuario_id || !nuevo.sucursal_id) {
      alert("Selecciona datos");
      return;
    }

    await crearMecanico({
      usuario_id: Number(nuevo.usuario_id),
      sucursal_id: Number(nuevo.sucursal_id),
    });

    setNuevo({ usuario_id: "", sucursal_id: "" });
    cargarDatos();
  };

  const getNombreUsuario = (id) => {
    const user = usuarios.find((u) => u.id_usuarios === id);
    return user ? user.nombre : "Desconocido";
  };

  const getNombreSucursal = (id) => {
    const suc = sucursales.find((s) => s.id === id);
    return suc ? suc.nombre : "Desconocida";
  };

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

              <span style={styles.badge}>Asignado</span>
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