import { useEffect, useState } from "react";

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://autogest-gateway.onrender.com";

function VehiculosPanel() {
  const [vehiculos, setVehiculos] =
    useState([]);

  const [busqueda, setBusqueda] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  useEffect(() => {
    cargarDatos();
  }, []);

  // ==========================
  // CARGAR DATOS
  // ==========================
  const cargarDatos = async () => {
    try {
      setLoading(true);
      setError("");

      // Cargar usuarios + vehículos en paralelo
      const [
        resVehiculos,
        resUsuarios,
      ] = await Promise.all([
        fetch(
          `${API_URL}/historial/vehiculos`
        ),
        fetch(
          `${API_URL}/usuarios`
        ),
      ]);

      const dataVehiculos =
        await resVehiculos.json();

      const dataUsuarios =
        await resUsuarios.json();

      // Cargar perfiles
      const perfiles =
        await Promise.all(
          dataVehiculos.map(
            async (vehiculo) => {
              try {
                const res =
                  await fetch(
                    `${API_URL}/perfil/${vehiculo.usuario_id}`
                  );

                if (
                  !res.ok
                ) {
                  return null;
                }

                return await res.json();

              } catch {
                return null;
              }
            }
          )
        );

      // Unir información
      const combinados =
        dataVehiculos.map(
          (
            vehiculo,
            index
          ) => {
            const usuario =
              dataUsuarios.find(
                (u) =>
                  u.id ===
                    vehiculo.usuario_id ||
                  u.id_usuarios ===
                    vehiculo.usuario_id
              );

            const perfil =
              perfiles[
                index
              ];

            return {
              ...vehiculo,

              nombre:
                usuario
                  ?.nombre ||
                "N/A",

              telefono:
                perfil
                  ?.telefono ||
                "N/A",

              documento:
                perfil
                  ?.documento ||
                "N/A",
            };
          }
        );

      setVehiculos(
        combinados
      );

    } catch (err) {
      console.error(
        "Error:",
        err
      );

      setError(
        "Error cargando vehículos"
      );

    } finally {
      setLoading(
        false
      );
    }
  };

  // ==========================
  // FILTRO
  // ==========================
  const vehiculosFiltrados =
    vehiculos.filter(
      (v) => {
        const texto =
          busqueda.toLowerCase();

        return (
          v.placa
            ?.toLowerCase()
            .includes(
              texto
            ) ||
          v.marca
            ?.toLowerCase()
            .includes(
              texto
            ) ||
          v.modelo
            ?.toLowerCase()
            .includes(
              texto
            ) ||
          v.nombre
            ?.toLowerCase()
            .includes(
              texto
            ) ||
          v.documento
            ?.toLowerCase()
            .includes(
              texto
            )
        );
      }
    );

  return (
    <div
      style={
        styles.container
      }
    >
      <h2
        style={
          styles.title
        }
      >
        🚗 Vehículos Registrados
      </h2>

      {/* BUSCADOR */}
      <input
        style={
          styles.buscar
        }
        placeholder="Buscar..."
        value={
          busqueda
        }
        onChange={(
          e
        ) =>
          setBusqueda(
            e.target
              .value
          )
        }
      />

      {/* ESTADOS */}
      {loading && (
        <p
          style={
            styles.mensaje
          }
        >
          Cargando...
        </p>
      )}

      {error && (
        <p
          style={
            styles.error
          }
        >
          {error}
        </p>
      )}

      {!loading &&
        vehiculosFiltrados.length ===
          0 && (
          <p
            style={
              styles.mensaje
            }
          >
            No se encontraron resultados
          </p>
        )}

      {/* TABLA */}
      {!loading &&
        vehiculosFiltrados.length >
          0 && (
          <div
            style={
              styles.tableWrapper
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
                    Placa
                  </th>
                  <th>
                    Marca
                  </th>
                  <th>
                    Modelo
                  </th>
                  <th>
                    Año
                  </th>
                  <th>
                    Usuario
                  </th>
                  <th>
                    Teléfono
                  </th>
                  <th>
                    Documento
                  </th>
                </tr>
              </thead>

              <tbody>
                {vehiculosFiltrados.map(
                  (
                    v
                  ) => (
                    <tr
                      key={
                        v.id
                      }
                    >
                      <td>
                        {
                          v.placa
                        }
                      </td>
                      <td>
                        {
                          v.marca
                        }
                      </td>
                      <td>
                        {
                          v.modelo
                        }
                      </td>
                      <td>
                        {
                          v.anio_fabricacion
                        }
                      </td>
                      <td>
                        {
                          v.nombre
                        }
                      </td>
                      <td>
                        {
                          v.telefono
                        }
                      </td>
                      <td>
                        {
                          v.documento
                        }
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
    width: "100%",
    background:
      "#1f2937",
    padding: "20px",
    borderRadius:
      "16px",
    boxSizing:
      "border-box",
    color: "white",
  },

  title: {
    textAlign:
      "center",
    marginBottom:
      "20px",
    fontSize:
      "clamp(22px, 4vw, 30px)",
  },

  buscar: {
    width: "100%",
    padding: "12px",
    marginBottom:
      "20px",
    borderRadius:
      "10px",
    border:
      "1px solid #374151",
    background:
      "#111827",
    color: "white",
    boxSizing:
      "border-box",
  },

  tableWrapper: {
    overflowX:
      "auto",
  },

  table: {
    width: "100%",
    minWidth:
      "900px",
    borderCollapse:
      "collapse",
    background:
      "#111827",
  },

  mensaje: {
    textAlign:
      "center",
  },

  error: {
    textAlign:
      "center",
    color:
      "#ef4444",
  },
};

export default VehiculosPanel;