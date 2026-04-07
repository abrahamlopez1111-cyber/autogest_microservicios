import { useState, useEffect } from "react";

import VerCitasMecanico from "./VerCitasMecanico";
import VehiculosMecanico from "./VehiculosMecanico";
import PerfilUsuario from "../../components/perfil/PerfilUsuario";
import PerfilGuard from "../../components/perfil/PerfilGuard";

// ============================
// 🚀 COMPONENTE PRINCIPAL
// ============================
function DashboardMecanico() {
  return (
    <PerfilGuard>
      <MecanicoContenido />
    </PerfilGuard>
  );
}

// ============================
// 🔧 CONTENIDO
// ============================
function MecanicoContenido() {
  const [vista, setVista] = useState(null);
  const [citaSeleccionada, setCitaSeleccionada] = useState(null);

  return (
    <div style={styles.container}>
      <div style={styles.panel}>

        {/* 🟢 MENÚ */}
        {!vista && (
          <>
            <h1 style={styles.title}>🔧 Panel Mecánico</h1>

            <div style={styles.cards}>
              <div style={styles.card} onClick={() => setVista("citas")}>
                <h3>📋 Ver Citas</h3>
                <p>Citas asignadas</p>
              </div>

              <div style={styles.card} onClick={() => setVista("vehiculos")}>
                <h3>🚗 Vehículos</h3>
                <p>Vehículos asignados</p>
              </div>

              <div style={styles.card} onClick={() => setVista("hoy")}>
                <h3>📅 Citas de Hoy</h3>
                <p>Servicios del día</p>
              </div>

              <div style={styles.card} onClick={() => setVista("perfil")}>
                <h3>👤 Mi Perfil</h3>
                <p>Gestionar información personal</p>
              </div>
            </div>
          </>
        )}

        {/* 🔵 CONTENIDO */}
        {vista && (
          <>
            <button style={styles.backBtn} onClick={() => {
              setVista(null);
              setCitaSeleccionada(null);
            }}>
              ⬅ Volver
            </button>

            <div style={styles.content}>
              {vista === "citas" && <VerCitasMecanico />}
              {vista === "vehiculos" && <VehiculosMecanico />}

              {/* 🔥 CITAS DE HOY */}
              {vista === "hoy" && !citaSeleccionada && (
                <CitasHoyMecanico onSeleccionar={setCitaSeleccionada} />
              )}

              {/* 🔥 FUTURO: DETALLE */}
              {citaSeleccionada && (
                <div style={styles.cardCita}>
                  <h3>🔍 Detalle de cita</h3>
                  <p>ID: {citaSeleccionada.id}</p>
                  <p>Cliente: {citaSeleccionada.usuario_id}</p>
                  <p>
                    Hora:{" "}
                    {new Date(
                      citaSeleccionada.fecha_hora_inicio
                    ).toLocaleTimeString("es-CO")}
                  </p>

                  <button
                    style={styles.backBtn}
                    onClick={() => setCitaSeleccionada(null)}
                  >
                    ⬅ Volver a lista
                  </button>
                </div>
              )}

              {vista === "perfil" && (
                <PerfilUsuario volver={() => setVista(null)} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ============================
// 📅 CITAS DE HOY (FIX REAL)
// ============================
function CitasHoyMecanico({ onSeleccionar }) {
  const [citas, setCitas] = useState([]);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔥 cargar usuario
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("usuario") || "null");
    setUsuario(user);
  }, []);

  // 🔥 cargar citas
  useEffect(() => {
    if (!usuario) return;

    const mecanicoId = usuario.id || usuario.id_usuarios;

    if (!mecanicoId) {
      console.warn("⛔ ID inválido");
      return;
    }

    const cargarCitasHoy = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:8000/citas/mecanico/${mecanicoId}`
        );

        const data = await res.json();

        // 🔥 fecha LOCAL segura
        const hoy = new Date().toLocaleDateString("en-CA");

        const filtradas = data.filter((c) => {
          if (!c.fecha_hora_inicio) return false;

          const fecha = new Date(c.fecha_hora_inicio)
            .toLocaleDateString("en-CA");

          return fecha === hoy;
        });

        setCitas(filtradas);

      } catch (error) {
        console.error("❌ Error:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarCitasHoy();
  }, [usuario]);

  return (
    <div>
      <h2>📅 Citas de Hoy</h2>

      {loading ? (
        <p>Cargando...</p>
      ) : citas.length === 0 ? (
        <p>No hay citas hoy</p>
      ) : (
        citas.map((c) => (
          <button
            key={c.id}
            style={styles.cardCita}
            onClick={() => onSeleccionar(c)} // 🔥 CLICK
          >
            <p><strong>Cliente:</strong> {c.usuario_id}</p>
            <p>
              <strong>Hora:</strong>{" "}
              {new Date(c.fecha_hora_inicio).toLocaleTimeString("es-CO")}
            </p>
          </button>
        ))
      )}
    </div>
  );
}

// ============================
// 🎨 ESTILOS
// ============================
const styles = {
  container: {
    padding: "40px",
    display: "flex",
    justifyContent: "center",
  },

  panel: {
    width: "100%",
    maxWidth: "1000px",
    background: "#020617",
    borderRadius: "15px",
    padding: "30px",
    color: "white",
  },

  title: {
    textAlign: "center",
    marginBottom: "30px",
  },

  cards: {
    display: "flex",
    gap: "20px",
    justifyContent: "center",
    flexWrap: "wrap",
  },

  card: {
    background: "#1e293b",
    padding: "20px",
    borderRadius: "12px",
    width: "250px",
    textAlign: "center",
    cursor: "pointer",
  },

  content: {
    marginTop: "30px",
  },

  backBtn: {
    marginBottom: "20px",
    padding: "10px",
    background: "#2563eb",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
  },

  cardCita: {
    background: "#1e293b",
    padding: "15px",
    borderRadius: "10px",
    marginBottom: "10px",
    border: "none",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
  },
};

export default DashboardMecanico;