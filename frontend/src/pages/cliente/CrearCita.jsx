import { useEffect, useState } from "react";
import { getUsuarios } from "../../services/usuariosApi";

const HORAS = [8, 9, 10, 11, 14, 15, 16, 17];

function CrearCita() {
  const usuario = JSON.parse(localStorage.getItem("usuario") || "null");

  const [form, setForm] = useState({
    sucursal_id: "",
    mecanico_id: "",
    vehiculo_id: "",
    fecha_hora_inicio: "",
  });

  const [fecha, setFecha] = useState("");
  const [horaSeleccionada, setHoraSeleccionada] = useState(null);
  const [horasOcupadas, setHorasOcupadas] = useState([]);

  const [sucursales, setSucursales] = useState([]);
  const [mecanicos, setMecanicos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    placa: "",
    marca: "",
    modelo: "",
    anio_fabricacion: "",
  });

  // =========================
  // 🔥 CARGA INICIAL
  // =========================
  useEffect(() => {
    if (!usuario) return;
    cargarDatos();
    cargarVehiculos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [sucRes, mecRes, usuariosRes] = await Promise.all([
        fetch("http://localhost:8000/sucursales"),
        fetch("http://localhost:8000/mecanicos"),
        getUsuarios(),
      ]);

      setSucursales(await sucRes.json());
      setMecanicos(await mecRes.json());
      setUsuarios(usuariosRes);

    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const cargarVehiculos = async () => {
    const res = await fetch(
      `http://localhost:8003/vehiculos/usuario/${usuario.id_usuarios}`
    );
    setVehiculos(await res.json());
  };

  // =========================
  // 🔥 DISPONIBILIDAD
  // =========================
  useEffect(() => {
    if (!form.mecanico_id || !fecha) return;

    const cargarDisponibilidad = async () => {
      try {
        const res = await fetch(
          `http://localhost:8000/citas/disponibilidad/${form.mecanico_id}/${fecha}`
        );

        const data = await res.json();
        setHorasOcupadas(data.ocupadas || []);

      } catch (error) {
        console.error("Error disponibilidad:", error);
      }
    };

    cargarDisponibilidad();

  }, [form.mecanico_id, fecha]);

  // =========================
  // 🧠 HELPERS
  // =========================
  const getNombreUsuario = (id) => {
    const user = usuarios.find((u) => u.id_usuarios === id);
    return user ? user.nombre : `Usuario ${id}`;
  };

  // =========================
  // ⏰ SELECCIONAR HORA
  // =========================
  const seleccionarHora = (h) => {
    setHoraSeleccionada(h);

    const fechaLocal = new Date(`${fecha}T${String(h).padStart(2, "0")}:00:00`);

    setForm({
      ...form,
      fecha_hora_inicio: fechaLocal.toISOString(),
    });
  };

  // =========================
  // 🚗 CREAR VEHÍCULO
  // =========================
  const crearVehiculo = async () => {
    if (!nuevoVehiculo.placa || !nuevoVehiculo.marca) {
      alert("Completa los datos");
      return;
    }

    const res = await fetch("http://localhost:8003/vehiculos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...nuevoVehiculo,
        anio_fabricacion: nuevoVehiculo.anio_fabricacion
          ? Number(nuevoVehiculo.anio_fabricacion)
          : null,
        usuario_id: usuario.id_usuarios,
      }),
    });

    const nuevo = await res.json();

    setMostrarModal(false);
    setNuevoVehiculo({
      placa: "",
      marca: "",
      modelo: "",
      anio_fabricacion: "",
    });

    await cargarVehiculos();

    setForm((prev) => ({
      ...prev,
      vehiculo_id: nuevo.id,
    }));
  };

  // =========================
  // 📅 CREAR CITA
  // =========================
  const handleSubmit = async () => {
    if (!horaSeleccionada) {
      alert("Selecciona una hora");
      return;
    }

    if (
      !form.sucursal_id ||
      !form.mecanico_id ||
      !form.vehiculo_id ||
      !form.fecha_hora_inicio
    ) {
      alert("Completa todos los campos");
      return;
    }

    const inicio = new Date(form.fecha_hora_inicio);
    const fin = new Date(inicio);
    fin.setHours(fin.getHours() + 1);

    const res = await fetch("http://localhost:8000/citas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...form,
        fecha_hora_fin: fin.toISOString(),
        usuario_id: usuario.id_usuarios,
      }),
    });

    if (!res.ok) {
      alert("Error creando cita");
      return;
    }

    alert("Cita creada 🚀");

    // 🔥 RESET COMPLETO
    setHoraSeleccionada(null);
    setFecha("");
    setHorasOcupadas([]);

    setForm({
      sucursal_id: "",
      mecanico_id: "",
      vehiculo_id: "",
      fecha_hora_inicio: "",
    });
  };

  // =========================
  // 🎨 UI
  // =========================
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📅 Crear Cita</h2>

      {/* Sucursal */}
      <select
        style={styles.input}
        value={form.sucursal_id}
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

      {/* 🔥 MECÁNICOS CORREGIDO */}
      <select
        style={styles.input}
        value={form.mecanico_id}
        onChange={(e) =>
          setForm({
            ...form,
            mecanico_id: Number(e.target.value),
          })
        }
      >
        <option value="">Mecánico</option>

        {mecanicos
          .filter((m) => m.sucursal_id === form.sucursal_id)
          .filter((m) => {
            const user = usuarios.find(
              (u) => u.id_usuarios === m.usuario_id
            );
            return user?.rol === "mecanico"; // 🔥 CLAVE
          })
          .map((m) => (
            <option key={m.id} value={m.id}>
              {getNombreUsuario(m.usuario_id)}
            </option>
          ))}
      </select>

      {/* Vehículo */}
      <select
        style={styles.input}
        value={form.vehiculo_id}
        onChange={(e) =>
          setForm({ ...form, vehiculo_id: Number(e.target.value) })
        }
      >
        <option value="">Vehículo</option>
        {vehiculos.map((v) => (
          <option key={v.id} value={v.id}>
            {v.placa}
          </option>
        ))}
      </select>

      <button style={styles.btnSecundario} onClick={() => setMostrarModal(true)}>
        + Agregar Vehículo
      </button>

      {/* Fecha */}
      <input
        type="date"
        style={styles.input}
        value={fecha}
        min={new Date().toISOString().split("T")[0]}
        onChange={(e) => {
          setFecha(e.target.value);
          setHoraSeleccionada(null);
        }}
      />

      {/* Horas */}
      <div style={styles.grid}>
        {HORAS.map((h) => {
          const ocupado = horasOcupadas.includes(h);
          const seleccionado = horaSeleccionada === h;

          return (
            <button
              key={h}
              disabled={ocupado}
              onClick={() => seleccionarHora(h)}
              style={{
                ...styles.hora,
                background: ocupado
                  ? "#ef4444"
                  : seleccionado
                  ? "#2563eb"
                  : "#10b981",
                transform: seleccionado ? "scale(1.1)" : "scale(1)",
                opacity: ocupado ? 0.6 : 1,
              }}
            >
              {h}:00
            </button>
          );
        })}
      </div>

      {/* Indicador */}
      {horaSeleccionada && (
        <p style={{ marginTop: "10px" }}>
          ⏰ Hora seleccionada: <strong>{horaSeleccionada}:00</strong>
        </p>
      )}

      <button style={styles.button} onClick={handleSubmit}>
        Crear Cita
      </button>
    </div>
  );
}

// 🎨 estilos
const styles = {
  container: {
    background: "#0f172a",
    padding: "25px",
    borderRadius: "12px",
    maxWidth: "500px",
    margin: "auto",
    color: "white",
  },
  title: { textAlign: "center" },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #374151",
    background: "#1e293b",
    color: "white",
    marginBottom: "10px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(4,1fr)",
    gap: "10px",
    marginTop: "10px",
  },
  hora: {
    padding: "10px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    transition: "0.2s",
  },
  button: {
    padding: "12px",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    marginTop: "10px",
  },
  btnSecundario: {
    background: "#10b981",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    color: "white",
  },
};

export default CrearCita;