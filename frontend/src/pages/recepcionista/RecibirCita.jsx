import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RecibirCita() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [cita, setCita] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [vehiculo, setVehiculo] = useState(null);

  const [form, setForm] = useState({
    kilometraje: "",
    observaciones: "",
  });

  const [loading, setLoading] = useState(true);

  // =========================
  // 🔥 CARGAR DETALLE
  // =========================
  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);

        // 🔥 1. traer cita
        const resCita = await fetch(`http://localhost:8000/citas/${id}`);
        const citaData = await resCita.json();

        // 🔥 2. traer usuario
        const resUsuarios = await fetch("http://localhost:8002/usuarios");
        const usuarios = await resUsuarios.json();

        const cliente = usuarios.find(
          (u) => u.id_usuarios === citaData.usuario_id
        );

        // 🔥 3. traer vehículo
        const resVehiculos = await fetch("http://localhost:8003/historial/vehiculos");
        const vehiculos = await resVehiculos.json();

        const vehiculoData = vehiculos.find(
          (v) => v.id === citaData.vehiculo_id
        );

        setCita(citaData);
        setUsuario(cliente);
        setVehiculo(vehiculoData);

      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, [id]);

  // =========================
  // 🚗 RECIBIR VEHÍCULO
  // =========================
  const handleRecibir = async () => {

    if (!form.kilometraje) {
      alert("Ingrese kilometraje");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/citas/${id}/recibir`,
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

      if (!res.ok) {
        alert("Error al recibir cita");
        return;
      }

      alert("Vehículo recibido correctamente ✅");

      navigate("/recepcionista/citas-hoy");

    } catch (error) {
      console.error(error);
      alert("Error de conexión");
    }
  };

  // =========================
  // 🎨 UI
  // =========================
  if (loading) return <p style={{ color: "white" }}>Cargando...</p>;

  if (!cita) return <p style={{ color: "white" }}>No encontrada</p>;

  return (
    <div style={styles.container}>

      <h2>🚗 Recepción de Vehículo</h2>

      <div style={styles.card}>
        <p><strong>Cliente:</strong> {usuario?.nombre || "N/A"}</p>
        <p><strong>Vehículo:</strong> {vehiculo?.placa || "N/A"}</p>
        <p><strong>Observación cliente:</strong> {cita.observacion_cliente || "N/A"}</p>
      </div>

      <div style={styles.card}>
        <h3>Datos de recepción</h3>

        <input
          type="number"
          placeholder="Kilometraje"
          value={form.kilometraje}
          onChange={(e) =>
            setForm({ ...form, kilometraje: e.target.value })
          }
          style={styles.input}
        />

        <textarea
          placeholder="Observaciones del recepcionista"
          value={form.observaciones}
          onChange={(e) =>
            setForm({ ...form, observaciones: e.target.value })
          }
          style={styles.textarea}
        />

        <button style={styles.btn} onClick={handleRecibir}>
          ✅ Confirmar recepción
        </button>
      </div>

      <button style={styles.volver} onClick={() => navigate(-1)}>
        ⬅ Volver
      </button>

    </div>
  );
}

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
    padding: "10px",
    marginTop: "10px",
  },

  textarea: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
  },

  btn: {
    marginTop: "15px",
    padding: "10px",
    background: "#2563eb",
    border: "none",
    color: "white",
    cursor: "pointer",
  },

  volver: {
    marginTop: "10px",
    padding: "10px",
    background: "#374151",
    border: "none",
    color: "white",
    cursor: "pointer",
  },
};

export default RecibirCita;