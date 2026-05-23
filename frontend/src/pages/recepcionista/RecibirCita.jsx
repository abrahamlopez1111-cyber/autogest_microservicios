import { useEffect, useState } from "react";

const GATEWAY = "https://autogest-gateway.onrender.com";

function RecibirCita({ citaId, onVolver, onExito }) {

  const [cita, setCita] = useState(null);
  const [vehiculo, setVehiculo] = useState(null);
  const [cliente, setCliente] = useState(null);

  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState("");

  const [form, setForm] = useState({
    kilometraje: "",
    observaciones: "",
  });

  // =========================
  // CARGAR DATOS
  // =========================
  useEffect(() => {
    if (citaId) {
      cargarDatos();
    }
  }, [citaId]);

  const cargarDatos = async () => {
    try {

      setLoading(true);
      setError("");

      const [
        resCita,
        resVehiculos,
        resUsuarios
      ] = await Promise.all([
        fetch(`${GATEWAY}/citas/${citaId}`),
        fetch(`${GATEWAY}/historial/vehiculos`),
        fetch(`${GATEWAY}/usuarios`),
      ]);

      if (
        !resCita.ok ||
        !resVehiculos.ok ||
        !resUsuarios.ok
      ) {
        throw new Error(
          "Error cargando datos"
        );
      }

      const citaData =
        await resCita.json();

      const vehiculos =
        await resVehiculos.json();

      const usuarios =
        await resUsuarios.json();

      console.log(
        "📅 Cita:",
        citaData
      );

      const vehiculoEncontrado =
        vehiculos.find(
          (v) =>
            Number(v.id) ===
            Number(citaData.vehiculo_id)
        );

      const clienteEncontrado =
        usuarios.find(
          (u) =>
            Number(u.id_usuarios) ===
            Number(citaData.usuario_id)
        );

      setCita(citaData);

      setVehiculo(
        vehiculoEncontrado || null
      );

      setCliente(
        clienteEncontrado || null
      );

    } catch (err) {

      console.error(err);

      setError(
        "Error cargando datos de la cita."
      );

    } finally {

      setLoading(false);

    }
  };

  // =========================
  // RECIBIR CITA
  // =========================
  const handleRecibir = async () => {

    if (!form.kilometraje) {

      setError(
        "El kilometraje es obligatorio."
      );

      return;
    }

    setGuardando(true);
    setError("");

    try {

      const payload = {
        kilometraje: Number(
          form.kilometraje
        ),
        observaciones:
          form.observaciones,
      };

      console.log(
        "📤 Enviando:",
        payload
      );

      const res = await fetch(
        `${GATEWAY}/citas/${citaId}/recibir`,
        {
          method: "PUT", // ✅ CORREGIDO
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(
            payload
          ),
        }
      );

      const data =
        await res.json();

      console.log(
        "📥 Respuesta:",
        data
      );

      if (!res.ok) {

        setError(
          data.detail ||
          "Error al registrar la recepción."
        );

        return;
      }

      // =========================
      // ÉXITO
      // =========================
      alert(
        "✅ Vehículo recibido correctamente"
      );

      if (onExito) {
        onExito(data);
      }

    } catch (err) {

      console.error(err);

      setError(
        "Error de conexión."
      );

    } finally {

      setGuardando(false);

    }
  };

  // =========================
  // LOADING
  // =========================
  if (loading) {

    return (
      <p
        style={{
          color: "white",
          textAlign: "center",
        }}
      >
        Cargando...
      </p>
    );
  }

  // =========================
  // RENDER
  // =========================
  return (
    <div style={styles.container}>

      <h2 style={styles.title}>
        📋 Recibir Vehículo
      </h2>

      {error && (
        <p style={styles.error}>
          {error}
        </p>
      )}

      {/* INFO CITA */}
      <div style={styles.card}>

        <h3 style={styles.cardTitle}>
          Datos de la cita
        </h3>

        <p style={styles.info}>
          <strong>
            Cliente:
          </strong>{" "}
          {cliente?.nombre || "—"}
        </p>

        <p style={styles.info}>
          <strong>
            Vehículo:
          </strong>{" "}
          {vehiculo
            ? `${vehiculo.marca} ${vehiculo.modelo} (${vehiculo.placa})`
            : "—"}
        </p>

        <p style={styles.info}>
          <strong>
            Año:
          </strong>{" "}
          {vehiculo?.anio_fabricacion ||
            "—"}
        </p>

        <p style={styles.info}>
          <strong>
            Observación del cliente:
          </strong>{" "}
          {cita?.observacion_cliente ||
            "Ninguna"}
        </p>

        <p style={styles.info}>
          <strong>
            Estado actual:
          </strong>{" "}
          {cita?.estado || "N/A"}
        </p>

      </div>

      {/* FORM */}
      <div style={styles.card}>

        <h3 style={styles.cardTitle}>
          Registrar recepción
        </h3>

        <label style={styles.label}>
          Kilometraje actual *
        </label>

        <input
          type="number"
          placeholder="Ej: 45000"
          value={form.kilometraje}
          onChange={(e) =>
            setForm({
              ...form,
              kilometraje:
                e.target.value,
            })
          }
          style={styles.input}
        />

        <label style={styles.label}>
          Observaciones adicionales
        </label>

        <textarea
          placeholder="Estado del vehículo al recibirlo..."
          value={form.observaciones}
          onChange={(e) =>
            setForm({
              ...form,
              observaciones:
                e.target.value,
            })
          }
          style={{
            ...styles.input,
            height: "80px",
            resize: "vertical",
          }}
        />

        <div style={styles.botones}>

          <button
            onClick={onVolver}
            style={styles.btnVolver}
          >
            ⬅ Cancelar
          </button>

          <button
            onClick={handleRecibir}
            disabled={guardando}
            style={styles.btnGuardar}
          >
            {guardando
              ? "Registrando..."
              : "✅ Confirmar recepción"}
          </button>

        </div>
      </div>
    </div>
  );
}

const styles = {

  container: {
    maxWidth: "600px",
    margin: "auto",
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  error: {
    color: "#ef4444",
    marginBottom: "12px",
    textAlign: "center",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "16px",
  },

  cardTitle: {
    margin: "0 0 12px",
    fontSize: "15px",
    color: "#94a3b8",
  },

  info: {
    margin: "6px 0",
    fontSize: "14px",
    color: "#cbd5e1",
  },

  label: {
    display: "block",
    fontSize: "13px",
    color: "#94a3b8",
    marginBottom: "4px",
    marginTop: "12px",
  },

  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
    fontSize: "14px",
    boxSizing: "border-box",
  },

  botones: {
    display: "flex",
    gap: "10px",
    marginTop: "16px",
  },

  btnVolver: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    background: "#334155",
    border: "none",
    color: "white",
    cursor: "pointer",
  },

  btnGuardar: {
    flex: 2,
    padding: "10px",
    borderRadius: "8px",
    background: "#16a34a",
    border: "none",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default RecibirCita;