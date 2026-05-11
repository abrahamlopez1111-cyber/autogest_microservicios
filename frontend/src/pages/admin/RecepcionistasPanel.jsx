import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8012";

function RecepcionistasPanel({ volver }) {
  const [usuarios, setUsuarios] = useState([]);
  const [recepcionistasDB, setRecepcionistasDB] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [disponibles, setDisponibles] = useState([]);

  const [loading, setLoading] = useState(false);

  const [nuevo, setNuevo] = useState({
    usuario_id: "",
    sucursal_id: "",
  });

  // =========================
  // CARGAR DATOS
  // =========================
  const cargarDatos = async () => {
    setLoading(true);

    try {
      const [resUsuarios, resRecep, resSuc] = await Promise.all([
        fetch(`${API_URL}/usuarios`),
        fetch(`${API_URL}/recepcionistas`),
        fetch(`${API_URL}/sucursales`),
      ]);

      if (!resUsuarios.ok || !resRecep.ok || !resSuc.ok) {
        throw new Error("Error cargando datos");
      }

      const usuariosData = await resUsuarios.json();
      const recepcionistasData = await resRecep.json();
      const sucursalesData = await resSuc.json();

      const usuariosRecep = usuariosData.filter(
        (u) => u.rol === "recepcionista"
      );

      const idsAsignados = recepcionistasData.map(
        (r) => r.usuario_id
      );

      const usuariosDisponibles = usuariosRecep.filter(
        (u) => !idsAsignados.includes(u.id_usuarios)
      );

      setUsuarios(usuariosData);
      setRecepcionistasDB(recepcionistasData);
      setSucursales(sucursalesData);
      setDisponibles(usuariosDisponibles);

    } catch (error) {
      console.error(error);
      alert("Error cargando información");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // =========================
  // CREAR
  // =========================
  const handleCrear = async () => {
    if (!nuevo.usuario_id || !nuevo.sucursal_id) {
      alert("Selecciona los datos");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/recepcionistas`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            usuario_id: Number(nuevo.usuario_id),
            sucursal_id: Number(nuevo.sucursal_id),
          }),
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      setNuevo({
        usuario_id: "",
        sucursal_id: "",
      });

      cargarDatos();

    } catch (error) {
      alert("Error creando recepcionista");
    }
  };

  // =========================
  // ELIMINAR
  // =========================
  const eliminar = async (id) => {
    if (!window.confirm("¿Eliminar asignación?")) return;

    try {
      const res = await fetch(
        `${API_URL}/recepcionistas/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error();
      }

      cargarDatos();

    } catch (error) {
      alert("Error eliminando");
    }
  };

  // =========================
  // HELPERS
  // =========================
  const getNombreUsuario = (id) => {
    const user = usuarios.find(
      (u) => u.id_usuarios === id
    );

    return user?.nombre || "Desconocido";
  };

  const getNombreSucursal = (id) => {
    const sucursal = sucursales.find(
      (s) => s.id === id
    );

    return sucursal?.nombre || "Desconocida";
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        🧑‍💼 Gestión de Recepcionistas
      </h2>

      <div style={styles.card}>
        <h3>Asignar Recepcionista</h3>

        <div style={styles.form}>
          <select
            style={styles.input}
            value={nuevo.usuario_id}
            onChange={(e) =>
              setNuevo({
                ...nuevo,
                usuario_id: e.target.value,
              })
            }
          >
            <option value="">
              Seleccione recepcionista
            </option>

            {disponibles.map((u) => (
              <option
                key={u.id_usuarios}
                value={u.id_usuarios}
              >
                {u.nombre}
              </option>
            ))}
          </select>

          <select
            style={styles.input}
            value={nuevo.sucursal_id}
            onChange={(e) =>
              setNuevo({
                ...nuevo,
                sucursal_id: e.target.value,
              })
            }
          >
            <option value="">
              Seleccione sucursal
            </option>

            {sucursales.map((s) => (
              <option key={s.id} value={s.id}>
                {s.nombre}
              </option>
            ))}
          </select>

          <button
            style={styles.btnCrear}
            onClick={handleCrear}
          >
            ➕ Asignar
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <h3>Recepcionistas Asignados</h3>

        {loading ? (
          <p>Cargando...</p>
        ) : recepcionistasDB.length === 0 ? (
          <p>No hay recepcionistas asignados</p>
        ) : (
          recepcionistasDB.map((r) => (
            <div key={r.id} style={styles.item}>
              <div>
                <strong>
                  {getNombreUsuario(r.usuario_id)}
                </strong>

                <p style={styles.sub}>
                  {getNombreSucursal(
                    r.sucursal_id
                  )}
                </p>
              </div>

              <button
                style={styles.btnEliminar}
                onClick={() =>
                  eliminar(r.id)
                }
              >
                ❌
              </button>
            </div>
          ))
        )}
      </div>

      <button
        style={styles.btnVolver}
        onClick={volver}
      >
        ⬅ Volver
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
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
  },

  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  input: {
    flex: "1",
    minWidth: "220px",
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #374151",
    background: "#111827",
    color: "white",
  },

  btnCrear: {
    padding: "12px 18px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },

  item: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "10px",
    padding: "12px 0",
    borderBottom: "1px solid #374151",
  },

  sub: {
    margin: 0,
    fontSize: "12px",
    color: "#9ca3af",
  },

  btnEliminar: {
    background: "#ef4444",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "8px 12px",
    cursor: "pointer",
  },

  btnVolver: {
    background: "#374151",
    color: "white",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default RecepcionistasPanel;