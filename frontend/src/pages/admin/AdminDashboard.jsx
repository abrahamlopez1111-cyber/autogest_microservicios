import { useState } from "react";

import UsuariosPanel from "./UsuariosPanel";
import SucursalesPanel from "./SucursalesPanel";
import MecanicosPanel from "./MecanicosPanel";
import RepuestosPanel from "./RepuestosPanel";
import VehiculosPanel from "./VehiculosPanel";
import RecepcionistasPanel from "./RecepcionistasPanel";

import PerfilUsuario from "../../components/perfil/PerfilUsuario";

function AdminDashboard() {

  const [vista, setVista] =
    useState("menu");

  return (

    <div style={styles.container}>

      <h1 style={styles.title}>
        ⚙️ Panel Administrador
      </h1>

      <p style={styles.subtitle}>
        Gestiona todos los módulos del sistema AutoGest
      </p>


      {/* MENU */}
      {vista === "menu" && (

        <div style={styles.grid}>

          <Card
            icon="👤"
            title="Usuarios"
            desc="Gestión de usuarios"
            onClick={() =>
              setVista(
                "usuarios"
              )
            }
          />

          <Card
            icon="🏢"
            title="Sucursales"
            desc="Administrar sedes"
            onClick={() =>
              setVista(
                "sucursales"
              )
            }
          />

          <Card
            icon="🔧"
            title="Mecánicos"
            desc="Personal técnico"
            onClick={() =>
              setVista(
                "mecanicos"
              )
            }
          />

          <Card
            icon="🧑‍💼"
            title="Recepcionistas"
            desc="Gestión del personal"
            onClick={() =>
              setVista(
                "recepcionistas"
              )
            }
          />

          <Card
            icon="🚗"
            title="Vehículos"
            desc="Vehículos registrados"
            onClick={() =>
              setVista(
                "vehiculos"
              )
            }
          />

          <Card
            icon="🧰"
            title="Repuestos"
            desc="Inventario"
            onClick={() =>
              setVista(
                "repuestos"
              )
            }
          />

          <Card
            icon="👤"
            title="Mi Perfil"
            desc="Información personal"
            onClick={() =>
              setVista(
                "perfil"
              )
            }
          />

        </div>

      )}


      {/* SUBVISTAS */}
      {vista !== "menu" && (

        <>

          <button
            style={
              styles.backBtn
            }
            onClick={() =>
              setVista(
                "menu"
              )
            }
          >
            ⬅ Volver al menú
          </button>

          <div style={styles.content}>

            {vista ===
              "usuarios" && (
              <UsuariosPanel
                volver={() =>
                  setVista(
                    "menu"
                  )
                }
              />
            )}

            {vista ===
              "sucursales" && (
              <SucursalesPanel
                volver={() =>
                  setVista(
                    "menu"
                  )
                }
              />
            )}

            {vista ===
              "mecanicos" && (
              <MecanicosPanel
                volver={() =>
                  setVista(
                    "menu"
                  )
                }
              />
            )}

            {vista ===
              "recepcionistas" && (
              <RecepcionistasPanel
                volver={() =>
                  setVista(
                    "menu"
                  )
                }
              />
            )}

            {vista ===
              "repuestos" && (
              <RepuestosPanel
                volver={() =>
                  setVista(
                    "menu"
                  )
                }
              />
            )}

            {vista ===
              "vehiculos" && (
              <VehiculosPanel
                volver={() =>
                  setVista(
                    "menu"
                  )
                }
              />
            )}

            {vista ===
              "perfil" && (
              <PerfilUsuario
                volver={() =>
                  setVista(
                    "menu"
                  )
                }
              />
            )}

          </div>

        </>

      )}

    </div>
  );
}



// CARD
function Card({
  icon,
  title,
  desc,
  onClick,
}) {

  return (

    <div
      style={styles.card}
      onClick={onClick}
    >

      <div style={styles.icon}>
        {icon}
      </div>

      <h2 style={styles.cardTitle}>
        {title}
      </h2>

      <p style={styles.cardDesc}>
        {desc}
      </p>

    </div>
  );
}



const styles = {

  container: {
    padding: "40px",
    minHeight:
      "100vh",
    background:
      "linear-gradient(135deg, #0f172a, #1e293b)",
    color:
      "white",
  },

  title: {
    textAlign:
      "center",
    fontSize:
      "32px",
  },

  subtitle: {
    textAlign:
      "center",
    marginBottom:
      "40px",
    color:
      "#94a3b8",
  },

  grid: {
    display:
      "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(260px, 1fr))",
    gap:
      "25px",
  },

  card: {
    background:
      "#1f2937",
    padding:
      "25px",
    borderRadius:
      "15px",
    cursor:
      "pointer",
    textAlign:
      "center",
  },

  icon: {
    fontSize:
      "40px",
  },

  cardTitle: {
    marginTop:
      "10px",
  },

  cardDesc: {
    color:
      "#9ca3af",
  },

  content: {
    marginTop:
      "20px",
  },

  backBtn: {
    marginBottom:
      "20px",
    padding:
      "10px 18px",
    background:
      "#2563eb",
    border:
      "none",
    borderRadius:
      "8px",
    color:
      "white",
    cursor:
      "pointer",
  },

};

export default AdminDashboard;