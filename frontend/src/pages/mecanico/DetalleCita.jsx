import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function DetalleCita() {
  const { id } = useParams();

  const [cita, setCita] = useState(null);
  const [repuestos, setRepuestos] = useState([]);

  const [form, setForm] = useState({
    descripcion_falla: "",
    reparacion: "",
    criticidad: "",
    repuestos: [],
  });

  // =========================
  // 🔥 CARGAR DATOS
  // =========================
  useEffect(() => {
    cargarCita();
    cargarRepuestos();
  }, []);

  const cargarCita = async () => {
    try {
      const res = await fetch(`http://localhost:8000/citas/${id}`);
      const data = await res.json();
      setCita(data);
    } catch (error) {
      console.error(error);
    }
  };

  const cargarRepuestos = async () => {
    try {
      const res = await fetch("http://localhost:8001/repuestos");
      const data = await res.json();
      setRepuestos(data);
    } catch (error) {
      console.error(error);
    }
  };

  // =========================
  // 🔥 MANEJO FORMULARIO
  // =========================
  const handleChange = (campo, valor) => {
    setForm({
      ...form,
      [campo]: valor,
    });
  };

  const toggleRepuesto = (rep) => {
    const existe = form.repuestos.includes(rep);

    if (existe) {
      setForm({
        ...form,
        repuestos: form.repuestos.filter((r) => r !== rep),
      });
    } else {
      setForm({
        ...form,
        repuestos: [...form.repuestos, rep],
      });
    }
  };

  // =========================
  // 💾 GUARDAR (SIMULADO)
  // =========================
  const guardarDiagnostico = async () => {
    console.log("Datos a enviar:", form);

    alert("Diagnóstico guardado (simulado) ✅");

    // 🔥 aquí luego irá tu microservicio 5
  };

  if (!cita) return <p style={{ color: "white" }}>Cargando...</p>;

  return (
    <div style={styles.container}>
      <h2>🔧 Detalle de Cita #{id}</h2>

      {/* ========================= */}
      {/* 📋 INFO VEHÍCULO */}
      {/* ========================= */}
      <div style={styles.card}>
        <h3>Información del Vehículo</h3>
        <p><strong>Placa:</strong> {cita.placa}</p>
        <p><strong>Marca:</strong> {cita.marca}</p>
        <p><strong>Modelo:</strong> {cita.modelo}</p>
      </div>

      {/* ========================= */}
      {/* 🧠 DIAGNÓSTICO */}
      {/* ========================= */}
      <div style={styles.card}>
        <h3>Diagnóstico</h3>

        <textarea
          placeholder="Descripción de la falla"
          value={form.descripcion_falla}
          onChange={(e) =>
            handleChange("descripcion_falla", e.target.value)
          }
          style={styles.textarea}
        />

        <textarea
          placeholder="Reparación realizada"
          value={form.reparacion}
          onChange={(e) =>
            handleChange("reparacion", e.target.value)
          }
          style={styles.textarea}
        />

        <select
          value={form.criticidad}
          onChange={(e) =>
            handleChange("criticidad", e.target.value)
          }
          style={styles.select}
        >
          <option value="">Nivel de criticidad</option>
          <option value="baja">Baja</option>
          <option value="media">Media</option>
          <option value="alta">Alta</option>
        </select>
      </div>

      {/* ========================= */}
      {/* 🧰 REPUESTOS */}
      {/* ========================= */}
      <div style={styles.card}>
        <h3>Repuestos utilizados</h3>

        <div style={styles.repuestos}>
          {repuestos.map((r) => (
            <label key={r.id} style={styles.checkbox}>
              <input
                type="checkbox"
                onChange={() => toggleRepuesto(r.nombre)}
              />
              {r.nombre}
            </label>
          ))}
        </div>
      </div>

      {/* ========================= */}
      {/* 💾 BOTÓN */}
      {/* ========================= */}
      <button style={styles.btn} onClick={guardarDiagnostico}>
        💾 Guardar Diagnóstico
      </button>
    </div>
  );
}

// =========================
// 🎨 ESTILOS
// =========================
const styles = {
  container: {
    color: "white",
    maxWidth: "800px",
    margin: "auto",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  textarea: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    background: "#0f172a",
    color: "white",
    border: "1px solid #334155",
  },

  select: {
    width: "100%",
    padding: "10px",
    marginTop: "10px",
    borderRadius: "8px",
    background: "#0f172a",
    color: "white",
  },

  repuestos: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },

  checkbox: {
    background: "#0f172a",
    padding: "8px",
    borderRadius: "8px",
  },

  btn: {
    width: "100%",
    padding: "15px",
    background: "#10b981",
    border: "none",
    borderRadius: "10px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default DetalleCita;