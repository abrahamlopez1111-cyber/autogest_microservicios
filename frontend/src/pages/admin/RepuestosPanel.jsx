import { useState, useEffect } from "react";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8012";

function RepuestosPanel() {
  const [datos, setDatos] = useState([]);
  const [sucursales, setSucursales] = useState([]);
  const [loading, setLoading] = useState(false);

  const [nombre, setNombre] = useState("");
  const [precio, setPrecio] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [sucursalId, setSucursalId] = useState("");

  const [busqueda, setBusqueda] = useState("");

  useEffect(() => {
    cargarDatos();
    obtenerSucursales();
  }, []);

  // =========================
  // INVENTARIO
  // =========================
  const cargarDatos = async () => {
    setLoading(true);

    try {
      const res = await fetch(
        `${API_URL}/inventario/repuestos/inventario-completo`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      setDatos(Array.isArray(data) ? data : []);

    } catch {
      alert("Error al cargar inventario");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // SUCURSALES
  // =========================
  const obtenerSucursales = async () => {
    try {
      const res = await fetch(
        `${API_URL}/sucursales`
      );

      if (!res.ok) throw new Error();

      const data = await res.json();

      setSucursales(
        Array.isArray(data) ? data : []
      );

    } catch {
      alert("Error cargando sucursales");
    }
  };

  // =========================
  // CREAR
  // =========================
  const agregar = async () => {
    if (
      !nombre ||
      !precio ||
      !cantidad ||
      !sucursalId
    ) {
      alert("Complete todos los campos");
      return;
    }

    try {
      // Crear repuesto
      const resProducto = await fetch(
        `${API_URL}/inventario/repuestos/`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            nombre,
            precio: Number(precio),
          }),
        }
      );

      if (!resProducto.ok) {
        throw new Error();
      }

      const producto =
        await resProducto.json();

      // Crear stock
      const resStock = await fetch(
        `${API_URL}/inventario/repuestos/stock`,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            sucursal_id:
              Number(sucursalId),

            catalogo_repuestos_id:
              producto.id,

            cantidad_disponible:
              Number(cantidad),
          }),
        }
      );

      if (!resStock.ok) {
        throw new Error();
      }

      alert("Guardado correctamente");

      limpiar();
      cargarDatos();

    } catch {
      alert("Error al guardar");
    }
  };

  const limpiar = () => {
    setNombre("");
    setPrecio("");
    setCantidad("");
    setSucursalId("");
  };

  // =========================
  // FILTRO
  // =========================
  const filtrados = datos.filter(
    (d) =>
      d.nombre
        ?.toLowerCase()
        .includes(
          busqueda.toLowerCase()
        )
  );

  // =========================
  // HELPER
  // =========================
  const nombreSucursal = (id) => {
    const sucursal =
      sucursales.find(
        (s) => s.id === id
      );

    return (
      sucursal?.nombre || "N/A"
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>
        📦 Inventario por Sucursal
      </h2>

      {/* BUSCADOR */}
      <input
        style={styles.buscar}
        placeholder="Buscar producto..."
        value={busqueda}
        onChange={(e) =>
          setBusqueda(
            e.target.value
          )
        }
      />

      {/* FORM */}
      <div style={styles.form}>
        <input
          style={styles.input}
          placeholder="Nombre"
          value={nombre}
          onChange={(e) =>
            setNombre(
              e.target.value
            )
          }
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Precio"
          value={precio}
          onChange={(e) =>
            setPrecio(
              e.target.value
            )
          }
        />

        <input
          style={styles.input}
          type="number"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) =>
            setCantidad(
              e.target.value
            )
          }
        />

        <select
          style={styles.input}
          value={sucursalId}
          onChange={(e) =>
            setSucursalId(
              e.target.value
            )
          }
        >
          <option value="">
            Seleccione sucursal
          </option>

          {sucursales.map(
            (s) => (
              <option
                key={s.id}
                value={s.id}
              >
                {s.nombre}
              </option>
            )
          )}
        </select>

        <button
          style={
            styles.btnAgregar
          }
          onClick={agregar}
        >
          Agregar
        </button>
      </div>

      {/* TABLA */}
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <div
          style={
            styles.tableContainer
          }
        >
          <table
            style={
              styles.table
            }
          >
            <thead>
              <tr>
                <th>
                  Producto
                </th>
                <th>
                  Precio
                </th>
                <th>
                  Cantidad
                </th>
                <th>
                  Sucursal
                </th>
              </tr>
            </thead>

            <tbody>
              {filtrados.map(
                (
                  item
                ) => (
                  <tr
                    key={
                      item.id
                    }
                  >
                    <td>
                      {
                        item.nombre
                      }
                    </td>

                    <td>
                      $
                      {
                        item.precio
                      }
                    </td>

                    <td>
                      {
                        item.cantidad
                      }
                    </td>

                    <td>
                      {nombreSucursal(
                        item.sucursal_id
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    padding: "20px",
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
  },

  buscar: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "20px",
  },

  form: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    flex: "1",
    minWidth: "180px",
    padding: "12px",
    borderRadius: "8px",
  },

  btnAgregar: {
    background: "green",
    color: "white",
    border: "none",
    borderRadius: "8px",
    padding: "12px 18px",
    cursor: "pointer",
  },

  tableContainer: {
    overflowX: "auto",
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
};

export default RepuestosPanel;