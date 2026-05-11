import { useState, useEffect } from "react";
import { getUsuarios } from "../../services/usuariosApi";

import {
  getMecanicos,
  crearMecanico,
  getSucursales,
  eliminarMecanico as eliminarMecanicoApi,
} from "../../services/citasApi";


function MecanicosPanel({ volver }) {

  const [mecanicos, setMecanicos] =
    useState([]);

  const [sucursales, setSucursales] =
    useState([]);

  const [usuarios, setUsuarios] =
    useState([]);

  const [disponibles, setDisponibles] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  const [nuevo, setNuevo] =
    useState({
      usuario_id: "",
      sucursal_id: "",
    });


  // =========================
  // CARGAR DATOS
  // =========================
  const cargarDatos = async () => {

    try {

      const usuariosData =
        await getUsuarios();

      const mecanicosDB =
        await getMecanicos();

      const suc =
        await getSucursales();


      // Solo usuarios mecánicos
      const usuariosMecanicos =
        usuariosData.filter(
          (u) =>
            u.rol ===
            "mecanico"
        );


      // IDs asignados
      const idsAsignados =
        mecanicosDB.map(
          (m) =>
            m.usuario_id
        );


      // Disponibles
      const mecanicosDisponibles =
        usuariosMecanicos.filter(
          (u) =>
            !idsAsignados.includes(
              u.id_usuarios
            )
        );


      setUsuarios(
        usuariosData || []
      );

      setMecanicos(
        mecanicosDB || []
      );

      setSucursales(
        suc || []
      );

      setDisponibles(
        mecanicosDisponibles
      );

    } catch (error) {

      console.error(
        "Error cargando:",
        error
      );

      alert(
        "No se pudieron cargar los datos"
      );
    }
  };


  useEffect(() => {
    cargarDatos();
  }, []);


  // =========================
  // CREAR
  // =========================
  const handleCrear = async () => {

    if (
      !nuevo.usuario_id ||
      !nuevo.sucursal_id
    ) {
      alert(
        "Selecciona todos los datos"
      );
      return;
    }

    try {

      setLoading(true);

      await crearMecanico({
        usuario_id:
          Number(
            nuevo.usuario_id
          ),

        sucursal_id:
          Number(
            nuevo.sucursal_id
          ),
      });

      setNuevo({
        usuario_id: "",
        sucursal_id: "",
      });

      await cargarDatos();

    } catch (error) {

      console.error(error);

      alert(
        "Error creando mecánico"
      );

    } finally {

      setLoading(false);
    }
  };


  // =========================
  // ELIMINAR
  // =========================
  const handleEliminar =
    async (id) => {

      if (
        !window.confirm(
          "¿Eliminar asignación?"
        )
      ) {
        return;
      }

      try {

        await eliminarMecanicoApi(
          id
        );

        await cargarDatos();

      } catch (error) {

        console.error(error);

        alert(
          "Error eliminando"
        );
      }
    };


  // =========================
  // HELPERS
  // =========================
  const getNombreUsuario =
    (id) => {

      const usuario =
        usuarios.find(
          (u) =>
            u.id_usuarios ===
            id
        );

      return usuario
        ? usuario.nombre
        : "No encontrado";
    };


  const getNombreSucursal =
    (id) => {

      const sucursal =
        sucursales.find(
          (s) =>
            s.id === id
        );

      return sucursal
        ? sucursal.nombre
        : "Desconocida";
    };


  return (

    <div style={styles.container}>

      <h2 style={styles.title}>
        🔧 Gestión de Mecánicos
      </h2>


      {/* FORM */}
      <div style={styles.card}>

        <h3>
          Asignar Mecánico
        </h3>

        <div style={styles.form}>

          <select
            style={
              styles.input
            }
            value={
              nuevo.usuario_id
            }
            onChange={(e) =>
              setNuevo({
                ...nuevo,
                usuario_id:
                  e.target
                    .value,
              })
            }
          >

            <option value="">
              Seleccione mecánico
            </option>

            {disponibles.map(
              (u) => (

                <option
                  key={
                    u.id_usuarios
                  }
                  value={
                    u.id_usuarios
                  }
                >
                  {u.nombre}
                </option>
              )
            )}

          </select>


          <select
            style={
              styles.input
            }
            value={
              nuevo.sucursal_id
            }
            onChange={(e) =>
              setNuevo({
                ...nuevo,
                sucursal_id:
                  e.target
                    .value,
              })
            }
          >

            <option value="">
              Seleccione sucursal
            </option>

            {sucursales.map(
              (s) => (

                <option
                  key={
                    s.id
                  }
                  value={
                    s.id
                  }
                >
                  {s.nombre}
                </option>
              )
            )}

          </select>


          <button
            style={
              styles.btnCrear
            }
            onClick={
              handleCrear
            }
            disabled={
              loading
            }
          >

            {loading
              ? "Asignando..."
              : "➕ Asignar"}

          </button>

        </div>

      </div>


      {/* LISTA */}
      <div style={styles.card}>

        <h3>
          Mecánicos Asignados
        </h3>

        {mecanicos.length ===
        0 ? (

          <p>
            No hay mecánicos
          </p>

        ) : (

          mecanicos.map(
            (m) => (

              <div
                key={
                  m.id
                }
                style={
                  styles.item
                }
              >

                <div
                  style={
                    styles.info
                  }
                >

                  <strong>
                    {getNombreUsuario(
                      m.usuario_id
                    )}
                  </strong>

                  <p
                    style={
                      styles.sub
                    }
                  >
                    {getNombreSucursal(
                      m.sucursal_id
                    )}
                  </p>

                </div>


                <div
                  style={
                    styles.actions
                  }
                >

                  <span
                    style={
                      styles.badge
                    }
                  >
                    Asignado
                  </span>

                  <button
                    style={
                      styles.btnEliminar
                    }
                    onClick={() =>
                      handleEliminar(
                        m.id
                      )
                    }
                  >
                    ❌
                  </button>

                </div>

              </div>
            )
          )
        )}

      </div>


      <button
        style={
          styles.btnVolver
        }
        onClick={volver}
      >
        ⬅ Volver
      </button>

    </div>
  );
}


const styles = {

  container: {
    width: "100%",
    maxWidth: "1000px",
    margin: "auto",
    padding: "15px",
    color: "white",
    boxSizing:
      "border-box",
  },

  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "clamp(22px, 4vw, 30px)",
  },

  card: {
    background:
      "#1f2937",
    padding: "20px",
    borderRadius: "16px",
    marginBottom: "20px",
  },

  form: {
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "12px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border:
      "1px solid #374151",
    background:
      "#111827",
    color: "white",
    boxSizing:
      "border-box",
  },

  btnCrear: {
    background:
      "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    minHeight: "45px",
    fontWeight: "bold",
  },

  item: {
    display: "flex",
    justifyContent:
      "space-between",
    alignItems: "center",
    gap: "15px",
    flexWrap: "wrap",
    padding: "15px 0",
    borderBottom:
      "1px solid #374151",
  },

  info: {
    flex: 1,
    minWidth: "180px",
  },

  sub: {
    margin: "5px 0",
    color: "#9ca3af",
    fontSize: "13px",
  },

  actions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  badge: {
    background:
      "#10b981",
    padding: "6px 10px",
    borderRadius: "8px",
    fontSize: "12px",
  },

  btnEliminar: {
    background:
      "#ef4444",
    border: "none",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  btnVolver: {
    width: "100%",
    background:
      "#374151",
    color: "white",
    border: "none",
    padding: "14px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};


export default MecanicosPanel;