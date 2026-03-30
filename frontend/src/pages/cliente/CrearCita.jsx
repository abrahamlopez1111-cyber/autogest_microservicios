import { useEffect, useState } from "react";
import { getUsuarios } from "../../services/usuariosApi";

function CrearCita() {
  const [form, setForm] = useState({
    sucursal_id: "",
    mecanico_id: "",
    vehiculo_id: "",
    fecha_hora_inicio: "",
    fecha_hora_fin: "",
  });

  const [sucursales, setSucursales] = useState([]);
  const [mecanicos, setMecanicos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);

  const [mostrarModal, setMostrarModal] = useState(false);

  const [nuevoVehiculo, setNuevoVehiculo] = useState({
    placa: "",
    marca: "",
    modelo: "",
  });

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
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

      const sucData = await sucRes.json();
      const mecData = await mecRes.json();

      setSucursales(sucData);
      setMecanicos(mecData);
      setUsuarios(usuariosRes);
    } catch (error) {
      console.error("Error cargando datos:", error);
    }
  };

  const cargarVehiculos = async () => {
    try {
      const res = await fetch(
        `http://localhost:8003/vehiculos/usuario/${usuario.id_usuarios}`
      );
      const data = await res.json();
      setVehiculos(data);
    } catch (error) {
      console.error("Error cargando vehículos:", error);
    }
  };

  const getNombreUsuario = (usuario_id) => {
    const user = usuarios.find((u) => u.id_usuarios === usuario_id);
    return user ? user.nombre : `Usuario ${usuario_id}`;
  };

  const crearVehiculo = async () => {
    if (!nuevoVehiculo.placa || !nuevoVehiculo.marca || !nuevoVehiculo.modelo) {
      alert("Completa los datos del vehículo");
      return;
    }

    try {
      await fetch("http://localhost:8003/vehiculos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...nuevoVehiculo,
          usuario_id: usuario.id_usuarios,
        }),
      });

      alert("Vehículo agregado 🚗");
      setMostrarModal(false);
      setNuevoVehiculo({ placa: "", marca: "", modelo: "" });
      cargarVehiculos();
    } catch (error) {
      console.error(error);
      alert("Error creando vehículo");
    }
  };

  const handleSubmit = async () => {
    if (
      !form.sucursal_id ||
      !form.mecanico_id ||
      !form.vehiculo_id ||
      !form.fecha_hora_inicio ||
      !form.fecha_hora_fin
    ) {
      alert("Completa todos los campos");
      return;
    }

    const nuevaCita = {
      ...form,
      usuario_id: usuario?.id_usuarios,
    };

    try {
      await fetch("http://localhost:8000/citas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevaCita),
      });

      alert("Cita creada 🚀");

      setForm({
        sucursal_id: "",
        mecanico_id: "",
        vehiculo_id: "",
        fecha_hora_inicio: "",
        fecha_hora_fin: "",
      });

    } catch (err) {
      console.error(err);
      alert("Error al crear cita");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>➕ Crear Cita</h2>

      {/* 🏢 Sucursal */}
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
        <option value="">Seleccione sucursal</option>
        {sucursales.map((s) => (
          <option key={s.id} value={s.id}>
            {s.nombre}
          </option>
        ))}
      </select>

      {/* 🔧 Mecánico */}
      <select
        style={styles.input}
        value={form.mecanico_id}
        onChange={(e) =>
          setForm({ ...form, mecanico_id: Number(e.target.value) })
        }
      >
        <option value="">Seleccione mecánico</option>

        {mecanicos
          .filter((m) => m.sucursal_id === form.sucursal_id)
          .map((m) => (
            <option key={m.id} value={m.id}>
              {getNombreUsuario(m.usuario_id)}
            </option>
          ))}
      </select>

      {/* 🚗 Vehículo */}
      <select
        style={styles.input}
        value={form.vehiculo_id}
        onChange={(e) =>
          setForm({ ...form, vehiculo_id: Number(e.target.value) })
        }
      >
        <option value="">Seleccione vehículo</option>
        {vehiculos.map((v) => (
          <option key={v.id} value={v.id}>
            {v.placa} - {v.marca} {v.modelo}
          </option>
        ))}
      </select>

      <button
        style={styles.btnSecundario}
        onClick={() => setMostrarModal(true)}
      >
        + Agregar Vehículo
      </button>

      {/* ⏰ Fechas */}
      <input
        style={styles.input}
        type="datetime-local"
        value={form.fecha_hora_inicio}
        onChange={(e) =>
          setForm({ ...form, fecha_hora_inicio: e.target.value })
        }
      />

      <input
        style={styles.input}
        type="datetime-local"
        value={form.fecha_hora_fin}
        onChange={(e) =>
          setForm({ ...form, fecha_hora_fin: e.target.value })
        }
      />

      <button style={styles.button} onClick={handleSubmit}>
        Crear Cita
      </button>

      {/* 🔥 MODAL */}
      {mostrarModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <h3>Agregar Vehículo</h3>

            <input
              style={styles.input}
              placeholder="Placa"
              value={nuevoVehiculo.placa}
              onChange={(e) =>
                setNuevoVehiculo({ ...nuevoVehiculo, placa: e.target.value })
              }
            />

            <input
              style={styles.input}
              placeholder="Marca"
              value={nuevoVehiculo.marca}
              onChange={(e) =>
                setNuevoVehiculo({ ...nuevoVehiculo, marca: e.target.value })
              }
            />

            <input
              style={styles.input}
              placeholder="Modelo"
              value={nuevoVehiculo.modelo}
              onChange={(e) =>
                setNuevoVehiculo({ ...nuevoVehiculo, modelo: e.target.value })
              }
            />

            <button style={styles.button} onClick={crearVehiculo}>
              Guardar
            </button>

            <button
              style={styles.btnCerrar}
              onClick={() => setMostrarModal(false)}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: "20px",
    background: "#0f172a",
    padding: "25px",
    borderRadius: "12px",
    maxWidth: "500px",
    marginInline: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    color: "white",
  },

  title: {
    textAlign: "center",
  },

  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #374151",
    background: "#1e293b",
    color: "white",
  },

  button: {
    padding: "12px",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },

  btnSecundario: {
    background: "#10b981",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  btnCerrar: {
    background: "#ef4444",
    border: "none",
    padding: "8px",
    borderRadius: "6px",
    color: "white",
    cursor: "pointer",
  },

  modal: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  modalContent: {
    background: "#1f2937",
    padding: "20px",
    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    width: "300px",
  },
};

export default CrearCita;