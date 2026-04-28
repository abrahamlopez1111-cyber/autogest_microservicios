import { useEffect, useState } from "react";

function RecepcionistasPanel({ volver }) {

  const [usuarios, setUsuarios] = useState([]);
  const [recepcionistasDB, setRecepcionistasDB] = useState([]);
  const [sucursales, setSucursales] = useState([]);
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
      const [resUsuarios, resRecep, resSuc] = await Promise.all([
        fetch("http://localhost:8002/usuarios"),
        fetch("http://localhost:8000/recepcionistas"),
        fetch("http://localhost:8000/sucursales"),
      ]);

      const usuariosData = await resUsuarios.json();
      const recepcionistasData = await resRecep.json();
      const sucursalesData = await resSuc.json();

      // 🔥 SOLO USUARIOS RECEPCIONISTAS
      const usuariosRecep = usuariosData.filter(
        (u) => u.rol === "recepcionista"
      );

      // 🔥 YA ASIGNADOS
      const idsAsignados = recepcionistasData.map((r) => r.usuario_id);

      // 🔥 DISPONIBLES
      const disponibles = usuariosRecep.filter(
        (u) => !idsAsignados.includes(u.id_usuarios)
      );

      setUsuarios(usuariosData);
      setRecepcionistasDB(recepcionistasData);
      setSucursales(sucursalesData);
      setDisponibles(disponibles);

    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // =========================
  // ➕ CREAR RECEPCIONISTA
  // =========================
  const handleCrear = async () => {

    if (!nuevo.usuario_id || !nuevo.sucursal_id) {
      alert("Selecciona datos");
      return;
    }

    try {
      await fetch("http://localhost:8000/recepcionistas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: Number(nuevo.usuario_id),
          sucursal_id: Number(nuevo.sucursal_id),
        }),
      });

      setNuevo({ usuario_id: "", sucursal_id: "" });
      cargarDatos();

    } catch (error) {
      alert("Error creando recepcionista");
    }
  };

  // =========================
  // ❌ ELIMINAR
  // =========================
  const eliminar = async (id) => {
    if (!confirm("¿Eliminar asignación?")) return;

    try {
      const res = await fetch(`http://localhost:8000/recepcionistas/${id}`, {
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
    return user ? user.nombre : "Desconocido";
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
      <h2 style={styles.title}>🧑‍💼 Gestión de Recepcionistas</h2>

      {/* FORM */}
      <div style={styles.card}>
        <h3>Asignar Recepcionista</h3>

        <div style={styles.form}>
          <select
            style={styles.input}
            value={nuevo.usuario_id}
            onChange={(e) =>
              setNuevo({ ...nuevo, usuario_id: e.target.value })
            }
          >
            <option value="">Seleccione recepcionista</option>

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
        <h3>Recepcionistas Asignados</h3>

        {recepcionistasDB.length === 0 ? (
          <p>No hay recepcionistas asignados</p>
        ) : (
          recepcionistasDB.map((r) => (
            <div key={r.id} style={styles.item}>
              <div>
                <strong>{getNombreUsuario(r.usuario_id)}</strong>
                <p style={styles.sub}>
                  {getNombreSucursal(r.sucursal_id)}
                </p>
              </div>

              <button
                style={styles.btnEliminar}
                onClick={() => eliminar(r.id)}
              >
                ❌
              </button>
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

export default RecepcionistasPanel;