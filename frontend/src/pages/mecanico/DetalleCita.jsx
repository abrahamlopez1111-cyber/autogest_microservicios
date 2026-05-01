import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function DetalleCita() {

  const { id } = useParams();
  const navigate = useNavigate();

  const [cita, setCita] = useState(null);
  const [recepcion, setRecepcion] = useState(null);
  const [vehiculo, setVehiculo] = useState(null);

  const [inventario, setInventario] = useState([]);

  const [repuestoSeleccionado, setRepuestoSeleccionado] =
    useState("");

  const [cantidadSeleccionada, setCantidadSeleccionada] =
    useState(1);

  const [form, setForm] = useState({
    descripcion_falla: "",
    reparacion_realizada: "",
    mano_obra: "",
    repuestos: [],
  });

  useEffect(() => {
    cargarTodo();
  }, []);

  // =========================
  // CARGAR INFORMACIÓN
  // =========================
  const cargarTodo = async () => {

    try {

      const usuario = JSON.parse(
        localStorage.getItem("usuario")
      );

      // buscar mecánico
      const resMecanicos = await fetch(
        "http://localhost:8000/mecanicos"
      );

      const mecanicos = await resMecanicos.json();

      const mecanico = mecanicos.find(
        m => m.usuario_id === usuario.id_usuarios
      );

      // cita
      const resCita = await fetch(
        `http://localhost:8000/citas/${id}`
      );

      const citaData = await resCita.json();

      // recepción
      const resRecepcion = await fetch(
        `http://localhost:8000/citas/${id}/recepcion`
      );

      const recepcionData = await resRecepcion.json();

      // vehículos
      const resVehiculos = await fetch(
        "http://localhost:8003/historial/vehiculos"
      );

      const vehiculos = await resVehiculos.json();

      const vehiculoEncontrado = vehiculos.find(
        v => v.id === citaData.vehiculo_id
      );

      // inventario completo de sucursal
      const resInventario = await fetch(
        `http://localhost:8004/inventario/repuestos/inventario-completo`
      );

      const inventarioData = await resInventario.json();

      const filtrado = inventarioData.filter(
        item => item.sucursal_id === mecanico.sucursal_id
      );

      setCita(citaData);
      setRecepcion(recepcionData);
      setVehiculo(vehiculoEncontrado);
      setInventario(filtrado);

    } catch (error) {

      console.error(error);

    }

  };

  // =========================
  // AGREGAR REPUESTO
  // =========================
  const agregarRepuesto = () => {

    if (!repuestoSeleccionado) {
      alert("Seleccione un repuesto");
      return;
    }

    const repuesto = inventario.find(
      r => r.id === Number(repuestoSeleccionado)
    );

    if (!repuesto) return;

    const existe = form.repuestos.find(
      r => r.repuesto_id === repuesto.id
    );

    if (existe) {
      alert("Ese repuesto ya fue agregado");
      return;
    }

    setForm({
      ...form,
      repuestos: [
        ...form.repuestos,
        {
          repuesto_id: repuesto.id,
          nombre: repuesto.nombre,
          precio: repuesto.precio,
          cantidad: cantidadSeleccionada,
        },
      ],
    });

    setRepuestoSeleccionado("");
    setCantidadSeleccionada(1);

  };

  // =========================
  // CAMBIAR CANTIDAD
  // =========================
  const cambiarCantidad = (
    repuesto_id,
    cantidad
  ) => {

    const nuevos = form.repuestos.map(
      item => {

        if (
          item.repuesto_id === repuesto_id
        ) {

          return {
            ...item,
            cantidad: Number(cantidad),
          };

        }

        return item;

      }
    );

    setForm({
      ...form,
      repuestos: nuevos,
    });

  };

  // =========================
  // GUARDAR
  // =========================
const guardarDiagnostico = async () => {

  if (
    !form.descripcion_falla ||
    !form.reparacion_realizada ||
    !form.mano_obra
  ) {
    alert("Complete todos los campos");
    return;
  }

  try {

    // =========================
    // 1. GUARDAR DIAGNÓSTICO
    // =========================
    const payload = {
      cita_id: Number(id),

      descripcion_falla:
        form.descripcion_falla,

      reparacion_realizada:
        form.reparacion_realizada,

      mano_obra:
        Number(form.mano_obra),

      repuestos:
        form.repuestos.map(
          r => ({
            repuesto_id: r.repuesto_id,
            cantidad: r.cantidad,
          })
        ),
    };

    const resDiagnostico = await fetch(
      "http://localhost:8005/diagnosticos/",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body:
          JSON.stringify(payload),
      }
    );

    if (!resDiagnostico.ok) {
      alert("Error guardando diagnóstico");
      return;
    }

    // =========================
    // 2. CAMBIAR ESTADO CITA
    // =========================
    const resEstado = await fetch(
      `http://localhost:8000/citas/${id}/estado/finalizada`,
      {
        method: "PUT",
      }
    );

    if (!resEstado.ok) {
      alert(
        "Diagnóstico guardado, pero no se actualizó la cita"
      );
      return;
    }

    // =========================
    // 3. FINAL
    // =========================
    alert(
      "Diagnóstico guardado correctamente ✅"
    );

    navigate("/mecanico");

  } catch (error) {

    console.error(error);

    alert(
      "Error de conexión"
    );

  }

};  

  if (!cita) {

    return (
      <p style={{ color: "white" }}>
        Cargando...
      </p>
    );

  }

  return (
    <div style={styles.container}>

      <button
        style={styles.back}
        onClick={() =>
          navigate("/mecanico")
        }
      >
        ← Volver
      </button>

      <h2>
        🔧 Detalle de Diagnóstico
      </h2>

      {/* DATOS */}
      <div style={styles.card}>

        <p>
          <strong>
            🚗 Vehículo:
          </strong>{" "}
          {
            vehiculo?.placa
          }
        </p>

        <p>
          <strong>
            📝 Cliente:
          </strong>{" "}
          {
            cita.observacion_cliente
          }
        </p>

        <p>
          <strong>
            📍 Recepción:
          </strong>{" "}
          {
            recepcion?.observaciones
          }
        </p>

        <p>
          <strong>
            🛣 Kilometraje:
          </strong>{" "}
          {
            recepcion?.kilometraje
          }
        </p>

      </div>

      {/* FORM */}
      <div style={styles.card}>

        <textarea
          placeholder="Descripción de la falla"
          value={
            form.descripcion_falla
          }
          onChange={(e) =>
            setForm({
              ...form,
              descripcion_falla:
                e.target.value,
            })
          }
          style={styles.textarea}
        />

        <textarea
          placeholder="Reparación realizada"
          value={
            form.reparacion_realizada
          }
          onChange={(e) =>
            setForm({
              ...form,
              reparacion_realizada:
                e.target.value,
            })
          }
          style={styles.textarea}
        />

        <input
          type="number"
          placeholder="Mano de obra"
          value={
            form.mano_obra
          }
          onChange={(e) =>
            setForm({
              ...form,
              mano_obra:
                e.target.value,
            })
          }
          style={styles.input}
        />

      </div>

      {/* INVENTARIO */}
      <div style={styles.card}>

        <h3>
          🧰 Inventario
        </h3>

        <select
          value={
            repuestoSeleccionado
          }
          onChange={(e) =>
            setRepuestoSeleccionado(
              e.target.value
            )
          }
          style={styles.select}
        >

          <option value="">
            Seleccione repuesto
          </option>

          {
            inventario.map(
              item => (

                <option
                  key={
                    item.id
                  }
                  value={
                    item.id
                  }
                >

                  {
                    item.nombre
                  } | Stock:
                  {
                    item.cantidad
                  } | $
                  {
                    item.precio
                  }

                </option>

              )
            )
          }

        </select>

        <input
          type="number"
          min="1"
          value={
            cantidadSeleccionada
          }
          onChange={(e) =>
            setCantidadSeleccionada(
              Number(
                e.target.value
              )
            )
          }
          style={styles.input}
        />

        <button
          style={
            styles.addBtn
          }
          onClick={
            agregarRepuesto
          }
        >
          ➕ Agregar
        </button>

      </div>

      {/* REPUESTOS USADOS */}
      <div style={styles.card}>

        <h3>
          🔩 Repuestos usados
        </h3>

        {
          form.repuestos.map(
            r => (

              <div
                key={
                  r.repuesto_id
                }
                style={
                  styles.row
                }
              >

                <span>
                  {
                    r.nombre
                  } (${r.precio})
                </span>

                <input
                  type="number"
                  min="1"
                  value={
                    r.cantidad
                  }
                  onChange={(
                    e
                  ) =>
                    cambiarCantidad(
                      r.repuesto_id,
                      e.target.value
                    )
                  }
                  style={{
                    width:
                      "80px",
                  }}
                />

              </div>

            )
          )
        }

      </div>

      <button
        style={
          styles.save
        }
        onClick={
          guardarDiagnostico
        }
      >
        Guardar diagnóstico
      </button>

    </div>
  );

}

const styles = {

  container: {
    maxWidth: "900px",
    margin: "auto",
    color: "white",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "20px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "10px",
  },

  textarea: {
    width: "100%",
    minHeight: "80px",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "10px",
  },

  select: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    marginTop: "10px",
  },

  addBtn: {
    width: "100%",
    marginTop: "10px",
    padding: "12px",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },

  row: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    marginTop: "10px",
  },

  save: {
    width: "100%",
    padding: "15px",
    background: "#16a34a",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
  },

  back: {
    marginBottom: "20px",
    padding: "10px 15px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
  },

};

export default DetalleCita;