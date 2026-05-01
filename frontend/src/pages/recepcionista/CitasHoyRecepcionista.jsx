import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function CitasHoyRecepcionista() {
  const navigate = useNavigate();

  const [citas, setCitas] = useState([]);
  const [loading, setLoading] = useState(true);

  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const [form, setForm] = useState({
    cita_id: null,
    kilometraje: "",
    observaciones: "",
  });

  // 🔥 NOTIFICACIÓN
  const [notificacion, setNotificacion] = useState({
    visible: false,
    mensaje: "",
    tipo: "",
  });

  const mostrarNotificacion = (
    mensaje,
    tipo = "success"
  ) => {
    setNotificacion({
      visible: true,
      mensaje,
      tipo,
    });

    setTimeout(() => {
      setNotificacion({
        visible: false,
        mensaje: "",
        tipo: "",
      });
    }, 2500);
  };

  // =========================
  // 🔥 CARGAR CITAS
  // =========================
  const cargarDatos = async () => {
    try {
      setLoading(true);

      const usuario = JSON.parse(
        localStorage.getItem("usuario")
      );

      // recepcionista
      const resRecep = await fetch(
        "http://localhost:8000/recepcionistas"
      );

      const recepcionistas =
        await resRecep.json();

      const recepcionista =
        recepcionistas.find(
          (r) =>
            r.usuario_id ===
            usuario.id_usuarios
        );

      if (!recepcionista) return;

      // citas de sucursal
      const resCitas = await fetch(
        `http://localhost:8000/citas/sucursal/${recepcionista.sucursal_id}/hoy`
      );

      const citasData =
        await resCitas.json();

      // solo programadas
      const citasFiltradas =
        citasData.filter(
          (c) =>
            c.estado ===
            "programada"
        );

      // datos extra
      const [
        resUsuarios,
        resVehiculos,
      ] = await Promise.all([
        fetch(
          "http://localhost:8002/usuarios"
        ),
        fetch(
          "http://localhost:8003/historial/vehiculos"
        ),
      ]);

      const usuariosData =
        await resUsuarios.json();

      const vehiculosData =
        await resVehiculos.json();

      setUsuarios(usuariosData);
      setVehiculos(vehiculosData);
      setCitas(citasFiltradas);

    } catch (error) {
      console.error(error);

      mostrarNotificacion(
        "Error cargando citas",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // =========================
  // 🚗 RECIBIR
  // =========================
  const recibir = async () => {
    if (!form.kilometraje) {
      mostrarNotificacion(
        "Ingrese el kilometraje",
        "error"
      );

      return;
    }

    try {
      const res = await fetch(
        `http://localhost:8000/citas/${form.cita_id}/recibir`,
        {
          method: "PUT",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            kilometraje: Number(
              form.kilometraje
            ),
            observaciones:
              form.observaciones,
          }),
        }
      );

      if (!res.ok) {
        mostrarNotificacion(
          "Error al guardar",
          "error"
        );

        return;
      }

      mostrarNotificacion(
        "Vehículo recibido correctamente ✅",
        "success"
      );

      // reset
      setForm({
        cita_id: null,
        kilometraje: "",
        observaciones: "",
      });

      // recargar lista
      setTimeout(() => {
        cargarDatos();
      }, 800);

    } catch (error) {
      console.error(error);

      mostrarNotificacion(
        "Error de conexión",
        "error"
      );
    }
  };

  // =========================
  // HELPERS
  // =========================
  const getNombre = (id) => {
    const u = usuarios.find(
      (x) =>
        x.id_usuarios === id
    );

    return u?.nombre || "N/A";
  };

  const getPlaca = (id) => {
    const v = vehiculos.find(
      (x) => x.id === id
    );

    return v?.placa || "N/A";
  };

  // =========================
  // UI
  // =========================
  return (
    <div style={styles.container}>

      {/* NOTIFICACIÓN */}
      {notificacion.visible && (
        <div
          style={{
            ...styles.toast,
            background:
              notificacion.tipo ===
              "success"
                ? "#16a34a"
                : "#dc2626",
          }}
        >
          {notificacion.mensaje}
        </div>
      )}

      {/* BOTÓN VOLVER */}
      <button
        style={styles.volver}
        onClick={() =>
          navigate("/recepcionista")
        }
      >
        ⬅ Volver
      </button>

      <h2>
        📅 Recepción de Vehículos
      </h2>

      {loading ? (
        <p>Cargando...</p>
      ) : citas.length === 0 ? (
        <p>
          No hay citas pendientes
        </p>
      ) : (
        citas.map((c) => (
          <div
            key={c.id}
            style={styles.card}
          >
            <p>
              <strong>
                Cliente:
              </strong>{" "}
              {getNombre(
                c.usuario_id
              )}
            </p>

            <p>
              <strong>
                Vehículo:
              </strong>{" "}
              {getPlaca(
                c.vehiculo_id
              )}
            </p>

            <p>
              <strong>
                Hora:
              </strong>{" "}
              {new Date(
                c.fecha_hora_inicio
              ).toLocaleTimeString()}
            </p>

            {form.cita_id ===
            c.id ? (
              <>
                <input
                  placeholder="Kilometraje"
                  value={
                    form.kilometraje
                  }
                  onChange={(
                    e
                  ) =>
                    setForm({
                      ...form,
                      kilometraje:
                        e.target
                          .value,
                    })
                  }
                  style={
                    styles.input
                  }
                />

                <textarea
                  placeholder="Observaciones"
                  value={
                    form.observaciones
                  }
                  onChange={(
                    e
                  ) =>
                    setForm({
                      ...form,
                      observaciones:
                        e.target
                          .value,
                    })
                  }
                  style={
                    styles.textarea
                  }
                />

                <button
                  style={
                    styles.btn
                  }
                  onClick={
                    recibir
                  }
                >
                  ✅ Confirmar
                </button>
              </>
            ) : (
              <button
                style={
                  styles.btn
                }
                onClick={() =>
                  setForm({
                    ...form,
                    cita_id:
                      c.id,
                  })
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

const styles = {
  container: {
    maxWidth: "700px",
    margin: "40px auto",
    color: "white",
  },

  card: {
    background: "#1e293b",
    padding: "15px",
    marginBottom: "15px",
    borderRadius: "10px",
  },

  input: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
  },

  textarea: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    border: "none",
    minHeight: "90px",
  },

  btn: {
    marginTop: "10px",
    padding: "10px 15px",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },

  volver: {
    marginBottom: "20px",
    padding: "10px 15px",
    background: "#374151",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },

  toast: {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "12px 20px",
    color: "white",
    borderRadius: "10px",
    fontWeight: "bold",
    zIndex: 9999,
    boxShadow:
      "0 5px 15px rgba(0,0,0,0.3)",
  },
};

export default CitasHoyRecepcionista;