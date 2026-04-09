import { useEffect, useState } from "react";
import { getUsuarios } from "../../services/usuariosApi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "../../styles/calendar.css";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HORAS = [8, 9, 10, 11, 14, 15, 16, 17];

const FESTIVOS = [
  "2026-01-01",
  "2026-05-01",
  "2026-07-20",
  "2026-08-07",
  "2026-12-25",
];

function CrearCita() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");
  const token = localStorage.getItem("token");
  const usuarioId = usuario?.id || usuario?.id_usuarios;

  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    sucursal_id: "",
    mecanico_id: "",
    vehiculo_id: "",
    fecha_hora_inicio: "",
    observacion_cliente: "", // 🔥 NUEVO
  });

  const [fecha, setFecha] = useState(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [horasOcupadas, setHorasOcupadas] = useState([]);

  const [sucursales, setSucursales] = useState([]);
  const [mecanicos, setMecanicos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    placa: "",
    marca: "",
    modelo: "",
    anio_fabricacion: "",
  });

  // 🔐 fetch con token
  const fetchAuth = (url, options = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(options.headers || {}),
      },
    });
  };

  // 🚀 carga inicial
  useEffect(() => {
    let mounted = true;

    if (!usuarioId) return;

    const init = async () => {
      setLoading(true);
      await Promise.all([cargarDatos(), cargarVehiculos()]);
      if (mounted) setLoading(false);
    };

    init();

    return () => (mounted = false);
  }, [usuarioId]);

  // 📥 datos generales
  const cargarDatos = async () => {
    const [sucRes, mecRes, usuariosRes] = await Promise.all([
      fetchAuth("http://localhost:8000/sucursales"),
      fetchAuth("http://localhost:8000/mecanicos"),
      getUsuarios(),
    ]);

    setSucursales(await sucRes.json());
    setMecanicos(await mecRes.json());
    setUsuarios(usuariosRes);
  };

  // 🚗 vehículos
  const cargarVehiculos = async () => {
    const res = await fetchAuth(
      `http://localhost:8003/vehiculos/usuario/${usuarioId}`
    );
    if (res.ok) setVehiculos(await res.json());
  };
  

  // 📅 días no laborales + días pasados
  const esDiaNoLaboral = (date) => {
    const hoy = new Date();

    // 🔥 quitar hora para comparar solo fechas
    hoy.setHours(0, 0, 0, 0);

    const fecha = new Date(date);
    fecha.setHours(0, 0, 0, 0);

    const dia = fecha.getDay();
    const fechaStr = fecha.toISOString().split("T")[0];

    // 🔥 condición completa
    return (
      fecha < hoy ||              // ❌ días pasados
      dia === 0 ||                // ❌ domingo
      dia === 6 ||                // ❌ sábado
      FESTIVOS.includes(fechaStr) // ❌ festivos
    );
  };

  // ⏱️ horas ocupadas
  useEffect(() => {
    if (!form.mecanico_id || !fecha) return;

    const fechaStr = fecha.toISOString().split("T")[0];

    fetchAuth(
      `http://localhost:8000/citas/disponibilidad/${form.mecanico_id}/${fechaStr}`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("DISPONIBILIDAD:", data);

        if (!data || !Array.isArray(data.ocupadas)) {
          setHorasOcupadas([]);
        } else {
          setHorasOcupadas(data.ocupadas);
        }
      });


  }, [form.mecanico_id, fecha]);

  // 🔥 bloquear horas pasadas del día actual
const esHoraPasada = (hora) => {
  if (!fecha) return false;

  const ahora = new Date();
  const fechaSeleccionada = new Date(fecha);

  // 🔥 comparar solo fechas (sin horas)
  ahora.setHours(0, 0, 0, 0);
  fechaSeleccionada.setHours(0, 0, 0, 0);

  const esHoy = ahora.getTime() === fechaSeleccionada.getTime();

  if (!esHoy) return false;

  const horaActual = new Date().getHours();

  return hora <= horaActual; // 🔥 clave
};


  // 🕐 seleccionar hora
  const seleccionarHora = (h) => {
    try {
      if (!fecha) {
        toast.warning("Selecciona una fecha primero");
        return;
      }

      const fechaObj = new Date(fecha);

      // 🔒 Validar fecha
      if (isNaN(fechaObj.getTime())) {
        console.error("Fecha inválida:", fecha);
        toast.error("Fecha inválida");
        return;
      }

      // 🔥 construir fecha manual (SIN toISOString directo)
      const year = fechaObj.getFullYear();
      const month = String(fechaObj.getMonth() + 1).padStart(2, "0");
      const day = String(fechaObj.getDate()).padStart(2, "0");

      const fechaStr = `${year}-${month}-${day}`;

      const fechaHora = new Date(`${fechaStr}T${h}:00:00`);

      if (isNaN(fechaHora.getTime())) {
        console.error("FechaHora inválida:", fechaHora);
        toast.error("Error generando la hora");
        return;
      }

      setHoraSeleccionada(h);

      setForm((prev) => ({
        ...prev,
        fecha_hora_inicio: fechaHora.toISOString(),
      }));

      toast.info(`⏰ Hora seleccionada: ${h}:00`);
    } catch (error) {
      console.error("ERROR seleccionarHora:", error);
      toast.error("Error inesperado");
    }
  };

  // 🚗 crear vehículo
  const crearVehiculo = async () => {
    if (!nuevoVehiculo.placa || !nuevoVehiculo.marca) {
      toast.error("Completa los campos obligatorios");
      return;
    }

    const res = await fetchAuth("http://localhost:8003/vehiculos", {
      method: "POST",
      body: JSON.stringify({
        ...nuevoVehiculo,
        usuario_id: usuarioId,
      }),
    });

    if (res.ok) {
      toast.success("Vehículo agregado 🚗");
      setShowModal(false);
      cargarVehiculos();
    } else {
      toast.error("Error al crear vehículo");
    }
  };

  // 📌 crear cita
  const handleSubmit = async () => {
    if (!form.sucursal_id || !form.mecanico_id || !form.vehiculo_id) {
      toast.warning("Completa todos los campos");
      return;
    }

    if (!form.fecha_hora_inicio) {
      toast.warning("Selecciona fecha y hora");
      return;
    }

    const inicio = new Date(form.fecha_hora_inicio);
    const fin = new Date(inicio);
    fin.setHours(fin.getHours() + 1);

    const res = await fetchAuth("http://localhost:8000/citas", {
      method: "POST",
      body: JSON.stringify({
        ...form,
        fecha_hora_fin: fin.toISOString(),
        usuario_id: usuarioId,
      }),
    });

    if (res.ok) {
      toast.success("Cita creada 🚀");
    } else {
      toast.error("Error al crear cita");
    }
  };

  // ⏳ loading
  if (loading) {
    return <h2 style={{ textAlign: "center" }}>⏳ Cargando...</h2>;
  }

  return (
    <div style={styles.container}>
      <ToastContainer />

      <h2>📅 Crear Cita</h2>

      {/* 🏢 Sucursal */}
      <select
        style={styles.input}
        onChange={(e) =>
          setForm({
            ...form,
            sucursal_id: Number(e.target.value),
            mecanico_id: "",
          })
        }
      >
        <option value="">Sucursal</option>
        {sucursales.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nombre}
          </option>
        ))}
      </select>

      {/* 🔧 Mecánico */}
      <select
        style={styles.input}
        onChange={(e) =>
          setForm({ ...form, mecanico_id: Number(e.target.value) })
        }
      >
        <option value="">Mecánico</option>
        {mecanicos
          .filter((m) => m.sucursal_id === form.sucursal_id)
          .map((m) => (
            <option key={m.id} value={m.id}>
              {
                usuarios.find((u) => u.id_usuarios === m.usuario_id)
                  ?.nombre
              }
            </option>
          ))}
      </select>

      {/* 🚗 Vehículo */}
      <select
        style={styles.input}
        onChange={(e) =>
          setForm({ ...form, vehiculo_id: Number(e.target.value) })
        }
      >
        <option value="">Vehículo</option>
        {vehiculos.map((v) => (
          <option key={v.id} value={v.id}>
            {v.marca} - {v.placa}
          </option>
        ))}
      </select>
      
      {/* 🔥 OBSERVACIÓN CLIENTE */}
      <textarea
        placeholder="Describe el problema del vehículo..."
        value={form.observacion_cliente}
        onChange={(e) =>
          setForm({ ...form, observacion_cliente: e.target.value })
        }
        style={styles.textarea}
      />

      <button style={styles.addBtn} onClick={() => setShowModal(true)}>
        ➕ Agregar Vehículo
      </button>

      <Calendar
        onChange={setFecha}
        value={fecha}
        tileDisabled={({ date }) => esDiaNoLaboral(date)}
        locale="es-ES"
      />





      {/* ⏰ Horas */}
      <div style={styles.grid}>
        {HORAS.map((h) => {
          const ocupado =
            Array.isArray(horasOcupadas) && horasOcupadas.includes(h);

          const pasada = esHoraPasada(h);
          const seleccionado = horaSeleccionada === h;

          return (
            <button
              key={h}
              disabled={ocupado || pasada}
              onClick={() => seleccionarHora(h)}
              style={{
                ...styles.hora,

                background: ocupado
                  ? "#ef4444"   // 🔴 ocupada
                  : pasada
                  ? "#374151"   // ⚫ pasada
                  : seleccionado
                  ? "#2563eb"   // 🔵 seleccionada
                  : "#10b981",  // 🟢 disponible

                cursor: ocupado || pasada ? "not-allowed" : "pointer",
                opacity: ocupado || pasada ? 0.6 : 1,

                transform: seleccionado ? "scale(1.05)" : "scale(1)",
                transition: "all 0.2s ease",
              }}
            >
              {h}:00
            </button>
          );
        })}
      </div>

      {/* 🚨 MENSAJE SI NO HAY HORAS DISPONIBLES */}
      {Array.isArray(horasOcupadas) &&
        HORAS.every((h) => horasOcupadas.includes(h) || esHoraPasada(h)) && (
          <p style={{ marginTop: "10px", color: "#f87171" }}>
            ⚠️ No hay horas disponibles para este día
          </p>
        )}

      <button style={styles.button} onClick={handleSubmit}>
        Crear Cita
      </button>

      {/* 🚗 Modal */}
      {showModal && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <h3>🚗 Nuevo Vehículo</h3>

            <input
              style={styles.modalInput}
              placeholder="Placa"
              onChange={(e) =>
                setNuevoVehiculo({
                  ...nuevoVehiculo,
                  placa: e.target.value,
                })
              }
            />
            <input
              style={styles.modalInput}
              placeholder="Marca"
              onChange={(e) =>
                setNuevoVehiculo({
                  ...nuevoVehiculo,
                  marca: e.target.value,
                })
              }
            />
            <input
              style={styles.modalInput}
              placeholder="Modelo"
              onChange={(e) =>
                setNuevoVehiculo({
                  ...nuevoVehiculo,
                  modelo: e.target.value,
                })
              }
            />
            <input
              style={styles.modalInput}
              placeholder="Año"
              onChange={(e) =>
                setNuevoVehiculo({
                  ...nuevoVehiculo,
                  anio_fabricacion: e.target.value,
                })
              }
            />

            <div style={styles.modalButtons}>
              <button style={styles.saveBtn} onClick={crearVehiculo}>
                Guardar
              </button>
              <button
                style={styles.cancelBtn}
                onClick={() => setShowModal(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// 🎨 estilos
const styles = {
  container: {
    padding: 30,
    maxWidth: 600,
    margin: "auto",
    color: "white",
  },
  input: {
    width: "100%",
    padding: 12,
    marginBottom: 12,
    borderRadius: 10,
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: 10,
    marginTop: 15,
  },
  hora: {
    padding: 12,
    borderRadius: 10,
    color: "white",
    border: "none",
    cursor: "pointer",
  },
  button: {
    marginTop: 20,
    padding: 12,
    width: "100%",
    background: "#2563eb",
    borderRadius: 10,
    color: "white",
    fontWeight: "bold",
  },
  addBtn: {
    marginBottom: 15,
    padding: 10,
    background: "#7c3aed",
    borderRadius: 10,
    color: "white",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.7)",
    backdropFilter: "blur(5px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 999,
  },
  modal: {
    background: "#020617",
    padding: 25,
    borderRadius: 16,
    width: "350px",
    border: "1px solid #1e293b",
  },
  modalInput: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    border: "1px solid #334155",
    background: "#0f172a",
    color: "white",
  },
  modalButtons: {
    display: "flex",
    justifyContent: "space-between",
  },
  saveBtn: {
    background: "#10b981",
    padding: 10,
    borderRadius: 8,
    color: "white",
    width: "48%",
  },
  cancelBtn: {
    background: "#ef4444",
    padding: 10,
    borderRadius: 8,
    color: "white",
    width: "48%",
  },

  textarea: {
  width: "100%",
  padding: 12,
  marginBottom: 12,
  borderRadius: 10,
  border: "1px solid #334155",
  background: "#0f172a",
  color: "white",
  minHeight: "80px",
},

};

export default CrearCita;