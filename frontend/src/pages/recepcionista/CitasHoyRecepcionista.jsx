import { useEffect, useState } from "react";

function CitasHoyRecepcionista() {

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const [form, setForm] = useState({
    cita_id: null,
    kilometraje: "",
    observaciones: "",
  });

  // =========================
  // 🔥 CARGAR CITAS DE SUCURSAL
  // =========================
  const cargarDatos = async () => {
    try {
      setLoading(true);

      const usuario = JSON.parse(localStorage.getItem("usuario"));

      // 🔥 traer recepcionista
      const resRecep = await fetch("http://localhost:8000/recepcionistas");
      const recepcionistas = await resRecep.json();

      const recepcionista = recepcionistas.find(
        (r) => r.usuario_id === usuario.id_usuarios
      );

      if (!recepcionista) return;

      // 🔥 traer citas de su sucursal
      const resCitas = await fetch(
        `http://localhost:8000/citas/sucursal/${recepcionista.sucursal_id}/hoy`
      );

      const citasData = await resCitas.json();

      // 🔥 solo las programadas (aún no recibidas)
      const citasFiltradas = citasData.filter(
        (c) => c.estado === "programada"
      );

      // 🔥 datos extra
      const [resUsuarios, resVehiculos] = await Promise.all([
        fetch("http://localhost:8002/usuarios"),
        fetch("http://localhost:8003/historial/vehiculos"),
      ]);

      const usuariosData = await resUsuarios.json();
      const vehiculosData = await resVehiculos.json();

      setUsuarios(usuariosData);
      setVehiculos(vehiculosData);
      setCitas(citasFiltradas);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // =========================
  // 🚗 RECIBIR VEHÍCULO
  // =========================
  const recibir = async () => {

    if (!form.kilometraje) {
      alert("Ingrese kilometraje");
      return;
    }

    try {
      await fetch(
        `http://localhost:8000/citas/${form.cita_id}/recibir`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            kilometraje: Number(form.kilometraje),
            observaciones: form.observaciones,
          }),
        }
      );

      alert("Vehículo recibido ✅");

      setForm({
        cita_id: null,
        kilometraje: "",
        observaciones: "",
      });

      cargarDatos();

    } catch (error) {
      alert("Error al recibir vehículo");
    }
  };

  // =========================
  // 🧠 HELPERS
  // =========================
  const getNombre = (id) => {
    const u = usuarios.find((x) => x.id_usuarios === id);
    return u?.nombre || "N/A";
  };

  const getPlaca = (id) => {
    const v = vehiculos.find((x) => x.id === id);
    return v?.placa || "N/A";
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2>📅 Recepción de Vehículos</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : citas.length === 0 ? (
        <p>No hay citas pendientes</p>
      ) : (
        citas.map((c) => (
          <div key={c.id} style={styles.card}>

            <p><strong>Cliente:</strong> {getNombre(c.usuario_id)}</p>
            <p><strong>Vehículo:</strong> {getPlaca(c.vehiculo_id)}</p>
            <p><strong>Hora:</strong> {new Date(c.fecha_hora_inicio).toLocaleTimeString()}</p>

            {form.cita_id === c.id ? (
              <>
                <input
                  placeholder="Kilometraje"
                  value={form.kilometraje}
                  onChange={(e) =>
                    setForm({ ...form, kilometraje: e.target.value })
                  }
                  style={styles.input}
                />

                <textarea
                  placeholder="Observaciones"
                  value={form.observaciones}
                  onChange={(e) =>
                    setForm({ ...form, observaciones: e.target.value })
                  }
                  style={styles.textarea}
                />

                <button style={styles.btn} onClick={recibir}>
                  ✅ Confirmar recepción
                </button>
              </>
            ) : (
              <button
                style={styles.btn}
                onClick={() =>
                  setForm({ ...form, cita_id: c.id })
                }
              >
                🚗 Recibir vehículo
              </button>
            )}
          </div>
        ))
      )}
    </div>
  );
}

// 🎨 estilos
const styles = {
  container: {
    maxWidth: "600px",
    margin: "auto",
    color: "white",
  },

  card: {
    background: "#1e293b",
    padding: "15px",
    marginBottom: "10px",
    borderRadius: "10px",
  },

  input: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
  },

  textarea: {
    width: "100%",
    padding: "8px",
    marginTop: "10px",
  },

  btn: {
    marginTop: "10px",
    padding: "10px",
    background: "#2563eb",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
};

export default CitasHoyRecepcionista;